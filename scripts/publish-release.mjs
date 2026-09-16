import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { packageFilenames, parseTag, root } from "./release-packages.mjs";

export function releasePolicy(releases, tag) {
  const version = parseTag(tag).split(".").map(BigInt);
  const existing = releases.find((release) => release.tag_name === tag);
  const newer = releases.some((release) => {
    if (release.draft || release.prerelease || !/^v(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/.test(release.tag_name)) return false;
    const other = parseTag(release.tag_name).split(".").map(BigInt);
    for (let index = 0; index < version.length; index += 1) {
      if (other[index] !== version[index]) return other[index] > version[index];
    }
    return false;
  });
  return { existing, latest: !newer };
}

export async function publishRelease() {
  const tag = process.env.RELEASE_TAG;
  parseTag(tag);
  const repository = process.env.GITHUB_REPOSITORY;
  assert.match(repository ?? "", /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/);
  const gh = (...args) => execFileSync("gh", [...args, "--repo", repository], { encoding: "utf8" });
  const releases = JSON.parse(execFileSync("gh", ["api", `repos/${repository}/releases?per_page=100`, "--paginate", "--slurp"], { encoding: "utf8" })).flat();
  const { existing, latest } = releasePolicy(releases, tag);
  assert.ok(!existing || existing.draft, `Release ${tag} is already published; published assets are never overwritten.`);
  const directory = path.join(root, "dist", tag);
  const names = [...Object.values(packageFilenames), "release-info.json", "SHA256SUMS.txt"];
  const records = await Promise.all(names.map(async (name) => {
    const bytes = await readFile(path.join(directory, name));
    return { name, size: bytes.length, digest: `sha256:${createHash("sha256").update(bytes).digest("hex")}` };
  }));
  const info = JSON.parse(await readFile(path.join(directory, "release-info.json"), "utf8"));
  assert.equal(info.tag, tag);
  assert.equal(info.sourceCommit, process.env.GITHUB_SHA, "Artifacts must come from this tagged commit");
  if (!existing) {
    gh("release", "create", tag, "--verify-tag", "--draft", "--title", `MTT Demo Creation Tools ${tag}`, "--notes-file", path.join(root, "plugins/RELEASE-NOTES.md"));
  }
  gh("release", "upload", tag, ...names.map((name) => path.join(directory, name)), "--clobber");
  const { assets } = JSON.parse(gh("release", "view", tag, "--json", "assets"));
  assert.deepEqual(assets.map((asset) => asset.name).sort(), [...names].sort(), "Unexpected or missing release assets");
  for (const record of records) {
    const asset = assets.find((entry) => entry.name === record.name);
    assert.equal(asset.size, record.size, `Upload size mismatch: ${record.name}`);
    if (asset.digest) assert.equal(asset.digest, record.digest, `Upload digest mismatch: ${record.name}`);
  }
  gh("release", "edit", tag, "--draft=false", `--latest=${latest}`);
  console.log(`Published https://github.com/${repository}/releases/tag/${tag}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  publishRelease().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}