import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { unzipSync } from "fflate";
import { PNG } from "pngjs";
import { parseDocument } from "yaml";
import { releasePolicy } from "./publish-release.mjs";
import { assemblePackages, createIcon, createZip, frontmatter, packageFilenames, parseTag, root, skillNames, validatePath, validateSkills } from "./release-packages.mjs";
import { validateRepositoryVersions } from "./validate-versions.mjs";

const skill = Buffer.from("---\nname: example\ndescription: Test skill.\nmetadata:\n  version: '1.0.0'\n---\n\n# Example\n");

test("release archives use environment-qualified demo builder filenames", () => {
  assert.deepEqual(packageFilenames, { cowork: "cowork-demo-builder.zip", scout: "scout-demo-builder.zip" });
});

test("workflow keeps candidate builds read-only and publishes only pushed version tags", async () => {
  const document = parseDocument(await readFile(new URL("../.github/workflows/release.yml", import.meta.url), "utf8"));
  assert.equal(document.errors.length, 0);
  const workflow = document.toJS();
  assert.deepEqual(workflow.on.push.tags, ["v*"]);
  assert.equal(workflow.on.workflow_dispatch.inputs.version.default, "v0.3.1");
  assert.equal(workflow.permissions.contents, "read");
  assert.equal(workflow.jobs.publish.permissions.contents, "write");
  assert.equal(workflow.jobs.publish.needs, "build");
  assert.equal(workflow.jobs.publish.if, "github.event_name == 'push' && startsWith(github.ref, 'refs/tags/v')");
  for (const job of Object.values(workflow.jobs)) {
    for (const step of job.steps.filter((entry) => entry.uses)) assert.match(step.uses, /@[a-f0-9]{40}$/);
  }
});

test("runtime changelogs use environment-qualified identities", async () => {
  const cases = [
    ["scout-demobuilder-2026.09.16.1-log.md", "scout-demobuilder", "Scout"],
    ["cowork-demo-builder-3.0.0-log.md", "cowork-demo-builder", "Cowork"]
  ];
  for (const [filename, logIdentity, environment] of cases) {
    const text = await readFile(path.join(root, "change logs", filename), "utf8");
    assert.match(text, new RegExp(`^# ${logIdentity} .+-log`, "m"));
    assert.match(text, /^## Skill name\r?\n\r?\ndemo-builder$/m);
    assert.match(text, new RegExp(`^## Environment\\r?\\n\\r?\\n${environment}$`, "m"));
  }
});

test("maintenance skills require the renamed data dependency release", async () => {
  for (const environment of ["scout", "cowork"]) {
    const text = await readFile(path.join(root, environment, "demo-builder-creator-maintenance-SKILL.md"), "utf8");
    assert.match(text, /\*\*Required version:\*\* `2026\.09\.16\.1` or newer\./);
  }
});

test("release policy promotes only the highest stable version and recognizes existing releases", () => {
  assert.equal(releasePolicy([], "v0.1.0").latest, true);
  const published = { tag_name: "v0.10.0", draft: false, prerelease: false };
  assert.equal(releasePolicy([published], "v0.2.0").latest, false);
  assert.equal(releasePolicy([published], "v1.0.0").latest, true);
  assert.equal(releasePolicy([published], "v0.10.0").existing, published);
  assert.equal(releasePolicy([{ ...published, draft: true }], "v0.1.0").latest, true);
  assert.equal(releasePolicy([{ ...published, prerelease: true }], "v0.1.0").latest, true);
});

test("accepts stable version tags and rejects malformed or prerelease tags", () => {
  assert.equal(parseTag("v1.2.3"), "1.2.3");
  for (const tag of [undefined, "v1", "1.2.3", "v01.2.3", "v1.2.3-rc.1", "v1.2.3+build", "v1.2.3/../../x"]) {
    assert.throws(() => parseTag(tag));
  }
});

test("rejects unsafe, hidden, reserved and traversal paths", () => {
  validatePath("skills/example/references/Guide.md");
  for (const filePath of ["", "../file", "/file", "skills//file", "skills/.hidden", "skills/CON.txt", "skills/COM1", "skills\\file", "C:/file", "file\0", "file.", "file "]) {
    assert.throws(() => validatePath(filePath), filePath);
  }
});

test("validates YAML, skill descriptions and folder identity", () => {
  assert.equal(frontmatter(skill, "skills/example").name, "example");
  assert.throws(() => frontmatter(skill, "different"), /mismatch/);
  assert.throws(() => frontmatter(Buffer.from("no frontmatter"), "example"));
  assert.throws(() => frontmatter(Buffer.from("---\nname: example\nname: duplicate\ndescription: Test\n---\n"), "example"), /Invalid YAML/);
});

test("validates companions and relative Markdown references", () => {
  const files = { "example/SKILL.md": Buffer.concat([skill, Buffer.from("[Guide](references/Guide.md)\n")]), "example/references/Guide.md": Buffer.from("# Guide") };
  validateSkills(files, ["example"]);
  assert.throws(() => validateSkills(files, ["example", "example"]), /Duplicate/);
  delete files["example/references/Guide.md"];
  assert.throws(() => validateSkills(files, ["example"]), /Missing local reference/);
});

test("enforces companion count, individual size and total size", () => {
  const files = { "example/SKILL.md": skill };
  for (let index = 0; index < 21; index += 1) files[`example/${index}.txt`] = Buffer.from("data");
  assert.throws(() => validateSkills(files, ["example"]), /Too many/);
  assert.throws(() => validateSkills({ "example/SKILL.md": skill, "example/big.csv": Buffer.alloc(5 * 1024 * 1024 + 1) }, ["example"]), /5 MB/);
  const big = Buffer.alloc(4 * 1024 * 1024);
  assert.throws(() => validateSkills({ "example/SKILL.md": skill, "example/one.csv": big, "example/two.csv": big, "example/three.csv": big }, ["example"]), /10 MB/);
});

test("ZIP bytes are reproducible regardless of input ordering", () => {
  const first = { "example/SKILL.md": skill, "example/data.csv": Buffer.from("data") };
  const second = Object.fromEntries(Object.entries(first).reverse());
  assert.deepEqual(createZip(first), createZip(second));
});

test("icons have the required dimensions and white transparent outline", () => {
  const color = PNG.sync.read(createIcon(192));
  assert.equal(color.width, 192);
  assert.equal(color.height, 192);
  const outline = PNG.sync.read(createIcon(32, true));
  assert.equal(outline.width, 32);
  assert.equal(outline.height, 32);
  let visible = 0;
  let transparent = 0;
  for (let offset = 0; offset < outline.data.length; offset += 4) {
    if (outline.data[offset + 3] === 0) transparent += 1;
    else {
      assert.deepEqual([...outline.data.subarray(offset, offset + 4)], [255, 255, 255, 255]);
      visible += 1;
    }
  }
  assert.ok(visible > 0 && transparent > 0);
});

test("Cowork ZIP includes every runtime reference with source content and excludes them from Scout", async () => {
  const { cowork, scout } = await assemblePackages("v1.0.0");
  const archive = unzipSync(createZip(cowork));
  const referenceRoot = path.join(root, "cowork/references");
  const entries = await readdir(referenceRoot, { recursive: true, withFileTypes: true });
  const references = entries.filter((entry) => entry.isFile()).map((entry) =>
    path.relative(referenceRoot, path.join(entry.parentPath, entry.name)).split(path.sep).join("/")
  ).sort();
  for (const required of ["PRESENTER-GUIDE.md", "QUALITY-STANDARDS.md", "TECHNOLOGY-GUIDANCE.md"]) {
    assert.ok(references.includes(required), `Missing required source reference: ${required}`);
  }
  const prefix = "skills/demo-builder/references/";
  assert.deepEqual(Object.keys(archive).filter((filePath) => filePath.startsWith(prefix)).sort(), references.map((filePath) => `${prefix}${filePath}`));
  for (const reference of references) {
    const source = await readFile(path.join(referenceRoot, reference));
    const expected = /\.(md|csv|json|txt)$/i.test(reference)
      ? Buffer.from(source.toString("utf8").replace(/\r\n/g, "\n"))
      : source;
    assert.ok(expected.length > 0, `Empty reference: ${reference}`);
    assert.deepEqual(Buffer.from(archive[`${prefix}${reference}`]), expected, reference);
  }
  assert.ok(!Object.keys(scout).some((filePath) => filePath.includes("/references/")));
});

test("release guides keep Cowork verification separate from Scout installation", async () => {
  const { cowork, scout } = await assemblePackages("v1.0.0");
  const guide = (await readFile(path.join(root, "plugins/INSTALL.md"), "utf8")).replace(/\r\n/g, "\n");
  for (const files of [cowork, scout]) {
    const archive = unzipSync(createZip(files));
    assert.equal(Buffer.from(archive["INSTALL.md"]).toString("utf8"), guide);
  }
  const website = await readFile(path.join(root, "docs/index.html"), "utf8");
  const readme = await readFile(path.join(root, "README.md"), "utf8");
  const verification = guide.match(/```text\n(Verify my installed demo tools[\s\S]*?)\n```/)?.[1];
  assert.ok(verification, "Bundled guide must include the Cowork verification prompt");
  const normalize = (text) => text?.replace(/\s+/g, " ").trim();
  assert.equal(normalize(website.match(/<pre id="cowork-prompt">([\s\S]*?)<\/pre>/)?.[1]), normalize(verification));
  assert.equal(normalize(readme.match(/```text\r?\n(Verify my installed demo tools[\s\S]*?)\r?\n```/)?.[1]), normalize(verification));
  for (const text of [guide, readme]) assert.match(text, /Cowork > Customize > Plugins > Add plugin/);
  assert.match(website, /Cowork &gt; Customize &gt; Plugins &gt; Add plugin/);
  assert.match(website, /aria-label="Copy Cowork verification prompt"/);
  for (const text of [guide, readme, website]) assert.doesNotMatch(text, /Download and install this release for my personal use in Cowork/);
  for (const text of [readme, website]) assert.match(text, /Download and install this release for my personal use in Scout/);
});

test("repository packages contain complete, isolated runtime skills without mutable sources", async () => {
  const { cowork, scout, manifest } = await assemblePackages("v1.0.0");
  assert.equal(manifest.version, "1.0.0");
  assert.deepEqual(manifest.agentSkills.map((entry) => entry.folder), skillNames.map((name) => `./skills/${name}`));
  for (const filePath of ["demo-builder-generate-data/SKILL.md", "demo-builder-generate-data/companies.csv", "demo-builder-generate-data/names.csv", "demo-builder-style-guidelines/SKILL.md"]) {
    assert.deepEqual(cowork[`skills/${filePath}`], scout[filePath]);
  }
  assert.match(cowork["skills/demo-builder/SKILL.md"].toString(), /No repository package/);
  assert.match(scout["demo-builder/SKILL.md"].toString(), /Will you be uploading to GitHub\?/);
  assert.ok(!scout["manifest.json"]);
  for (const files of [cowork, scout]) {
    assert.ok(!Object.keys(files).some((filePath) => /creator-maintenance|edit-guardrails/.test(filePath)));
    for (const [filePath, bytes] of Object.entries(files).filter(([filePath]) => filePath.endsWith(".md"))) {
      assert.doesNotMatch(bytes.toString(), /raw\.githubusercontent\.com\/rob-foulkrod\/mtt-demo-creation-tools\/main|\/Documents\/Cowork\/skills|DEMO-INSTRUCTIONS-REFERENCE\.docx/, filePath);
    }
    const prefix = files === cowork ? "skills/" : "";
    const data = files[`${prefix}demo-builder-generate-data/SKILL.md`].toString();
    assert.match(data, /Never invent a company or person name/);
    assert.match(data, /Cross-check every generated name/);
    assert.match(data, /Never derive a variant/);
    const demo = files[`${prefix}demo-builder/SKILL.md`].toString();
    for (const rule of [/Microsoft Fake Company/, /Classification: Public/, /approval/i, /No silent overwrite|overwrite/i, /sample-data/, /re-list/i]) {
      assert.match(demo, rule);
    }
  }
});

test("current skill logs and plugin release markers stay version-aligned", async () => {
  const result = await validateRepositoryVersions("v0.3.1");
  assert.equal(result.skills.length, 7);
  assert.equal(result.releaseTag, "v0.3.1");
  await assert.rejects(validateRepositoryVersions("v9.9.9"), /does not match Cowork manifest v0\.3\.1/);
});