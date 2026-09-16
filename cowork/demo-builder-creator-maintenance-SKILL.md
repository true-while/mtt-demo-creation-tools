---
name: demo-builder-creator-maintenance
description: |
  Creator-only support skill for maintaining the Cowork demo-builder skill, companion references,
  local installed copies, version numbers, and change logs. Always loads the shared edit guardrails
  support skill before edits. Do not use for end-user demo package creation.
metadata:
  version: "1.2.0"
  cowork-category: "automation"
  cowork-icon: "Tools"
---

## Purpose

Use this support skill only when a repository maintainer or skill creator asks to update, split,
install, validate, or publish the Cowork demo-builder skill and its companion files.

Do not load or expose these maintenance instructions during ordinary end-user demo package creation.
End-user demo workflows use `cowork/demo-builder-SKILL.md` plus its runtime references.

Before editing any Scout or Cowork demo-builder skill, support skill, or companion reference, load
the shared edit guardrails support skill and follow its cross-skill parity checks.

## Canonical source

- **Public repository:** `https://github.com/rob-foulkrod/mtt-demo-creation-tools`
- **Cowork runtime skill:** `https://raw.githubusercontent.com/rob-foulkrod/mtt-demo-creation-tools/main/cowork/demo-builder-SKILL.md`
- **Creator maintenance support skill:** `https://raw.githubusercontent.com/rob-foulkrod/mtt-demo-creation-tools/main/cowork/demo-builder-creator-maintenance-SKILL.md`
- **Shared edit guardrails support skill:** `https://raw.githubusercontent.com/rob-foulkrod/mtt-demo-creation-tools/main/Common/demo-builder-edit-guardrails-SKILL.md`
- **Change logs folder:** `https://github.com/rob-foulkrod/mtt-demo-creation-tools/tree/main/change%20logs`
- **Demo Builder Generate Data folder:** `https://github.com/rob-foulkrod/mtt-demo-creation-tools/tree/main/Common/demo-builder-generate-data`

Use only the public GitHub repository above as the source of truth for skill source files,
companion references, support skills, demo-builder-generate-data files, change logs, updates, and documentation.
Do not use a personal SharePoint, OneDrive, Teams file, internal catalog, or private folder as a
canonical source.

## Demo Builder Generate Data dependency maintenance

- **Required version:** `2026.09.16.1` or newer.
- Install the `demo-builder-generate-data` skill as a complete folder containing `SKILL.md`, `companies.csv`, and
  `names.csv`.
- When downloading directly, use the raw files from:
  1. `https://raw.githubusercontent.com/rob-foulkrod/mtt-demo-creation-tools/main/Common/demo-builder-generate-data/SKILL.md`
  2. `https://raw.githubusercontent.com/rob-foulkrod/mtt-demo-creation-tools/main/Common/demo-builder-generate-data/companies.csv`
  3. `https://raw.githubusercontent.com/rob-foulkrod/mtt-demo-creation-tools/main/Common/demo-builder-generate-data/names.csv`

## Local file validation

- **Cowork skill path:** `/Documents/Cowork/skills/demo-builder/SKILL.md`.
- **Demo Builder Generate Data skill folder:** `/Documents/Cowork/skills/demo-builder-generate-data`.
- Before running a maintenance update, validate that the Cowork skill local path exists and that the
  demo-builder-generate-data folder contains `SKILL.md`, `companies.csv`, and `names.csv`.
- If any required local file is missing, offer to download and install it from the full public GitHub
  URL before continuing.
- If the maintainer provides a different Cowork skills root, validate that path instead and
  report the exact path used.

## Change log requirement

- Every update to the Cowork runtime skill, companion references, or this support skill must write a
  change log file in `https://github.com/rob-foulkrod/mtt-demo-creation-tools/tree/main/change%20logs`.
- Name each Cowork runtime change log `cowork-demo-builder-<skill-version>-log.md`; for runtime
  version `3.0.0`, use `cowork-demo-builder-3.0.0-log.md`.
- The runtime change log title must be `cowork-demo-builder <skill-version>-log`.
- Keep `Skill name` as the registered name `demo-builder`, and include an `Environment` section set
  to `Cowork`.
- This support skill's own logs continue using `<skill-name>-<skill-version>-log.md`.
- The change log must include `Skill name`, `Environment` for runtime logs, `Skill version`,
  `Additions`, and `Deletions` sections.
  If there are no deletions, write `None`.
- Commit the change log file in the same commit as the skill update.

## Updating the Cowork runtime skill

When the user asks to update the Cowork demo-builder skill:

1. Read the canonical runtime skill and companion references before editing.
2. Load the shared edit guardrails support skill and apply its parity, source-of-truth, and
   regression checks before changing files.
3. Increment the semantic version in frontmatter `metadata.version` and the **Current version**
   line. Use a patch version for wording or fixes, a minor version for backward-compatible behavior
   additions, and a major version for incompatible workflow or output-structure changes.
4. Keep end-user runtime instructions in `cowork/demo-builder-SKILL.md`.
5. Move creator-only maintenance material into this support skill.
6. Move detailed runtime reference material into focused companion files under `cowork/references/`
   and reference them from the main skill only one level deep.
7. Write the required change log file for the new version.
8. Apply the change to the active personal skill when requested, then validate and score it.
9. Commit the identical validated runtime `SKILL.md`, companion references, support skill updates,
   and change log changes back to `https://github.com/rob-foulkrod/mtt-demo-creation-tools`.
10. Read the saved canonical files again from GitHub and verify that their versions and content match
   before reporting completion.

## Progressive-disclosure regression checks

Before committing a split or refactor:

1. Confirm `cowork/demo-builder-SKILL.md` is below 500 lines and targets fewer than 5,000 tokens.
2. Confirm the core workflow remains complete when the main skill activates.
3. Confirm detailed material lives in focused companion files referenced from the skill root.
4. Confirm companion count and file sizes remain within Cowork package limits.
5. Confirm no quality, safety, publishing, or verification requirement was removed; it must either
   remain in the main skill or move to an explicit companion reference.
6. Confirm end-user demo creation does not surface creator-only update, versioning, local install,
   change-log, or repository maintenance steps.
