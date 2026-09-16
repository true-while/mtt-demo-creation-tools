import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import Ajv from "ajv-draft-04";
import addFormats from "ajv-formats";
import { unzipSync, zipSync } from "fflate";
import MarkdownIt from "markdown-it";
import { PNG } from "pngjs";
import { parseDocument } from "yaml";
import { validateRepositoryVersions } from "./validate-versions.mjs";

export const root = fileURLToPath(new URL("../", import.meta.url));
export const schemaUrl = "https://developer.microsoft.com/json-schemas/teams/v1.28/MicrosoftTeams.schema.json";
export const skillNames = ["demo-builder", "demo-builder-generate-data", "demo-builder-style-guidelines"];
export const packageFilenames = Object.freeze({ cowork: "cowork-demo-builder.zip", scout: "scout-demo-builder.zip" });
const markdown = new MarkdownIt();

export function parseTag(tag) {
  assert.match(tag ?? "", /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/, "Use a stable release tag vMAJOR.MINOR.PATCH (no leading zeros or prerelease suffix).");
  return tag.slice(1);
}

export function validatePath(filePath) {
  assert.ok(typeof filePath === "string" && filePath.length > 0, "Empty package path");
  for (const segment of filePath.split("/")) {
    assert.match(segment, /^[A-Za-z0-9_!][A-Za-z0-9_!. -]*$/, `Unsafe package path: ${filePath}`);
    assert.ok(!/[. ]$/.test(segment), `Unsafe trailing character: ${filePath}`);
    assert.ok(!/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(segment), `Reserved package path: ${filePath}`);
  }
}

export function frontmatter(bytes, folder) {
  const text = Buffer.from(bytes).toString("utf8");
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  assert.ok(match, `Missing YAML frontmatter: ${folder}`);
  const document = parseDocument(match[1]);
  assert.equal(document.errors.length, 0, `Invalid YAML: ${folder}: ${document.errors.join(", ")}`);
  const data = document.toJS();
  assert.match(data?.name ?? "", /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `Invalid skill name: ${folder}`);
  assert.ok(data.name.length <= 64, `Skill name too long: ${folder}`);
  assert.equal(data.name, path.posix.basename(folder), `Skill name/folder mismatch: ${folder}`);
  assert.ok(typeof data.description === "string" && data.description.trim().length > 0 && data.description.length <= 1024, `Invalid description: ${folder}`);
  return data;
}

export function validateSkills(files, folders) {
  assert.ok(folders.length > 0 && folders.length <= 20, "Package must contain 1-20 skills");
  assert.equal(new Set(folders).size, folders.length, "Duplicate skill folders");
  const paths = Object.keys(files);
  paths.forEach(validatePath);
  assert.equal(new Set(paths.map((filePath) => filePath.toLowerCase())).size, paths.length, "Case-insensitive path collision");
  for (const folder of folders) {
    validatePath(folder);
    assert.ok(folder.length <= 256, `Skill folder too long: ${folder}`);
    const skillPath = `${folder}/SKILL.md`;
    assert.ok(files[skillPath], `Missing ${skillPath}`);
    frontmatter(files[skillPath], folder);
    const companions = paths.filter((filePath) => filePath.startsWith(`${folder}/`) && filePath !== skillPath);
    assert.ok(companions.length <= 20, `Too many companions: ${folder}`);
    assert.ok(companions.every((filePath) => files[filePath].length <= 5 * 1024 * 1024), `Companion exceeds 5 MB: ${folder}`);
    assert.ok(companions.reduce((total, filePath) => total + files[filePath].length, 0) <= 10 * 1024 * 1024, `Companions exceed 10 MB: ${folder}`);
  }
  for (const filePath of paths.filter((entry) => entry.endsWith(".md"))) {
    const text = Buffer.from(files[filePath]).toString("utf8");
    for (const token of markdown.parse(text, {})) {
      for (const child of token.children ?? []) {
        const target = child.type === "link_open" ? child.attrGet("href") : child.type === "image" ? child.attrGet("src") : null;
        if (!target || /^(?:[a-z]+:|#)/i.test(target)) continue;
        const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(filePath), decodeURIComponent(target.split("#")[0])));
        assert.ok(files[resolved], `Missing local reference in ${filePath}: ${target}`);
      }
    }
  }
}

export function createIcon(size, outline = false) {
  const image = new PNG({ width: size, height: size });
  for (let row = 0; row < size; row += 1) {
    for (let column = 0; column < size; column += 1) {
      const horizontal = column / size;
      const vertical = row / size;
      const frame = horizontal >= 0.25 && horizontal < 0.75 && vertical >= 0.2 && vertical < 0.8 &&
        (horizontal < 0.31 || horizontal >= 0.69 || vertical < 0.26 || vertical >= 0.74);
      const lines = horizontal >= 0.37 && horizontal < 0.63 &&
        ((vertical >= 0.38 && vertical < 0.44) || (vertical >= 0.56 && vertical < 0.62));
      const color = frame || lines ? [255, 255, 255, 255] : outline ? [0, 0, 0, 0] : [177, 31, 75, 255];
      image.data.set(color, (row * size + column) * 4);
    }
  }
  return PNG.sync.write(image);
}

export function createZip(files) {
  const entries = Object.fromEntries(Object.keys(files).sort().map((filePath) => [filePath, [files[filePath], { mtime: new Date(2000, 0, 1) }]]));
  return zipSync(entries, { level: 9 });
}

async function sourceFile(relativePath) {
  const bytes = await readFile(path.join(root, relativePath));
  return /\.(md|csv|json|txt)$/i.test(relativePath) || relativePath === "LICENSE"
    ? Buffer.from(bytes.toString("utf8").replace(/\r\n/g, "\n"))
    : bytes;
}

async function addDirectory(files, source, destination) {
  for (const entry of await readdir(path.join(root, source), { withFileTypes: true })) {
    const sourcePath = `${source}/${entry.name}`;
    const destinationPath = `${destination}/${entry.name}`;
    validatePath(destinationPath);
    if (entry.isDirectory()) await addDirectory(files, sourcePath, destinationPath);
    else {
      assert.ok(entry.isFile(), `Only regular files are allowed: ${sourcePath}`);
      files[destinationPath] = await sourceFile(sourcePath);
    }
  }
}

export async function assemblePackages(tag) {
  const version = parseTag(tag);
  const shared = {};
  await addDirectory(shared, "Common/demo-builder-generate-data", "demo-builder-generate-data");
  shared["demo-builder-style-guidelines/SKILL.md"] = await sourceFile("Common/demo-builder-style-guidelines-SKILL.md");
  for (const required of ["demo-builder-generate-data/SKILL.md", "demo-builder-generate-data/companies.csv", "demo-builder-generate-data/names.csv"]) {
    assert.ok(shared[required]?.length, `Missing or empty dependency: ${required}`);
  }
  const scout = { ...shared, "demo-builder/SKILL.md": await sourceFile("scout/demo-builder-SKILL.md") };
  const cowork = Object.fromEntries(Object.entries(shared).map(([filePath, bytes]) => [`skills/${filePath}`, bytes]));
  cowork["skills/demo-builder/SKILL.md"] = await sourceFile("cowork/demo-builder-SKILL.md");
  await addDirectory(cowork, "cowork/references", "skills/demo-builder/references");
  const manifest = JSON.parse(await readFile(path.join(root, "plugins/cowork-manifest.json"), "utf8"));
  manifest.version = version;
  assert.equal(manifest.manifestVersion, "1.28");
  assert.equal(manifest.$schema, schemaUrl);
  assert.deepEqual(manifest.agentSkills.map((skill) => skill.folder), skillNames.map((name) => `./skills/${name}`));
  cowork["manifest.json"] = Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`);
  cowork["color.png"] = createIcon(192);
  cowork["outline.png"] = createIcon(32, true);
  for (const files of [cowork, scout]) {
    files["LICENSE"] = await sourceFile("LICENSE");
    files["INSTALL.md"] = await sourceFile("plugins/INSTALL.md");
  }
  validateSkills(cowork, skillNames.map((name) => `skills/${name}`));
  validateSkills(scout, skillNames);
  return { cowork, scout, manifest };
}

export async function validateManifest(manifest) {
  const response = await fetch(schemaUrl, { signal: AbortSignal.timeout(30000) });
  assert.ok(response.ok, `Cannot fetch manifest schema: HTTP ${response.status}`);
  const schemaBytes = await response.text();
  const ajv = new Ajv({ strict: false, allErrors: true });
  addFormats(ajv);
  const validate = ajv.compile(JSON.parse(schemaBytes));
  assert.ok(validate(manifest), `Invalid M365 manifest: ${ajv.errorsText(validate.errors)}`);
  return createHash("sha256").update(schemaBytes).digest("hex");
}

export async function buildPackages(tag) {
  await validateRepositoryVersions(tag);
  const { cowork, scout, manifest } = await assemblePackages(tag);
  const schemaSha256 = await validateManifest(manifest);
  const artifacts = {};
  for (const [filename, files] of [[packageFilenames.cowork, cowork], [packageFilenames.scout, scout]]) {
    const archive = createZip(files);
    const unpacked = unzipSync(archive);
    assert.deepEqual(Object.keys(unpacked).sort(), Object.keys(files).sort());
    for (const filePath of Object.keys(files)) assert.deepEqual(Buffer.from(unpacked[filePath]), Buffer.from(files[filePath]));
    artifacts[filename] = archive;
  }
  const info = {
    tag,
    version: manifest.version,
    appId: manifest.id,
    sourceCommit: process.env.GITHUB_SHA ?? null,
    schemaUrl,
    schemaSha256,
    skillVersions: Object.fromEntries([
      ["cowork", cowork, "skills/"], ["scout", scout, ""]
    ].map(([environment, files, prefix]) => [environment, Object.fromEntries(skillNames.map((name) => [name, frontmatter(files[`${prefix}${name}/SKILL.md`], name).metadata?.version]))]))
  };
  artifacts["release-info.json"] = Buffer.from(`${JSON.stringify(info, null, 2)}\n`);
  artifacts["SHA256SUMS.txt"] = Buffer.from(Object.entries(artifacts).map(([filename, bytes]) => `${createHash("sha256").update(bytes).digest("hex")}  ${filename}\n`).join(""));
  const destination = path.join(root, "dist", tag);
  await mkdir(destination, { recursive: true });
  for (const [filename, bytes] of Object.entries(artifacts)) await writeFile(path.join(destination, filename), bytes);
  console.log(`Validated ${tag}: ${destination}`);
  console.log("Cowork personal sideloading and Scout installation still require user testing.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  buildPackages(process.argv[2]).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}