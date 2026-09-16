import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseDocument } from "yaml";

export const root = fileURLToPath(new URL("../", import.meta.url));

const skills = [
  { source: "scout/demo-builder-SKILL.md", logIdentity: "scout-demobuilder", environment: "Scout", packaged: true },
  { source: "cowork/demo-builder-SKILL.md", logIdentity: "cowork-demo-builder", environment: "Cowork", packaged: true },
  { source: "scout/demo-builder-creator-maintenance-SKILL.md", logIdentity: "demo-builder-creator-maintenance" },
  { source: "cowork/demo-builder-creator-maintenance-SKILL.md", logIdentity: "demo-builder-creator-maintenance" },
  { source: "Common/demo-builder-edit-guardrails-SKILL.md", logIdentity: "demo-builder-edit-guardrails" },
  { source: "Common/demo-builder-generate-data/SKILL.md", logIdentity: "demo-builder-generate-data", packaged: true },
  { source: "Common/demo-builder-style-guidelines-SKILL.md", logIdentity: "demo-builder-style-guidelines", packaged: true }
];

function frontmatter(text, source) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  assert.ok(match, `Missing YAML frontmatter: ${source}`);
  const document = parseDocument(match[1]);
  assert.equal(document.errors.length, 0, `Invalid YAML: ${source}: ${document.errors.join(", ")}`);
  return document.toJS();
}

function section(text, heading) {
  return text.match(new RegExp(`^## ${heading}\\r?\\n\\r?\\n([^\\r\\n]+)$`, "m"))?.[1].trim();
}

export async function validateRepositoryVersions(releaseTag) {
  const checkedSkills = [];
  for (const skill of skills) {
    const data = frontmatter(await readFile(path.join(root, skill.source), "utf8"), skill.source);
    const version = data?.metadata?.version;
    assert.match(version ?? "", /^\d+(?:\.\d+){2,3}$/, `Invalid metadata.version: ${skill.source}`);

    const logName = `${skill.logIdentity}-${version}-log.md`;
    let log;
    try {
      log = await readFile(path.join(root, "change logs", logName), "utf8");
    } catch (error) {
      if (error.code === "ENOENT") assert.fail(`Missing current change log for ${skill.source}: change logs/${logName}`);
      throw error;
    }
    assert.equal(log.match(/^# ([^\r\n]+)$/m)?.[1], `${skill.logIdentity} ${version}-log`, `Change log title mismatch: ${logName}`);
    assert.equal(section(log, "Skill name"), data.name, `Change log skill name mismatch: ${logName}`);
    assert.equal(section(log, "Skill version"), version, `Change log skill version mismatch: ${logName}`);
    if (skill.environment) assert.equal(section(log, "Environment"), skill.environment, `Change log environment mismatch: ${logName}`);
    checkedSkills.push({ source: skill.source, name: data.name, version, packaged: skill.packaged === true });
  }

  const manifestPath = path.join(root, "plugins/cowork-manifest.json");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  assert.match(manifest.version ?? "", /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/, "Invalid plugins/cowork-manifest.json version");
  const currentTag = `v${manifest.version}`;
  if (releaseTag !== undefined) assert.equal(releaseTag, currentTag, `Release tag ${releaseTag} does not match Cowork manifest ${currentTag}`);

  const workflow = parseDocument(await readFile(path.join(root, ".github/workflows/release.yml"), "utf8")).toJS();
  assert.equal(workflow.on.workflow_dispatch.inputs.version.default, currentTag, "Release workflow default does not match Cowork manifest");
  assert.match(workflow.jobs.build.env.RELEASE_TAG, new RegExp(`\\|\\| '${currentTag.replaceAll(".", "\\.")}' \\}\\}$`), "Release workflow fallback does not match Cowork manifest");

  const packagedNames = [...new Set(checkedSkills.filter((skill) => skill.packaged).map((skill) => skill.name))];
  assert.deepEqual(manifest.agentSkills.map((skill) => skill.folder), packagedNames.map((name) => `./skills/${name}`), "Cowork manifest skills do not match packaged skills");
  return { releaseTag: currentTag, skills: checkedSkills };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  validateRepositoryVersions(process.argv[2]).then(({ releaseTag, skills: checkedSkills }) => {
    for (const skill of checkedSkills) console.log(`${skill.source}: ${skill.version}`);
    console.log(`plugins/cowork-manifest.json: ${releaseTag}`);
    console.log(`Validated ${checkedSkills.length} skill versions and current change logs.`);
  }).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}