---
name: demo-builder-creator-maintenance
description: |
  Creator-only support skill for maintaining the Scout demo-builder skill, local installed copy,
  version numbers, change logs, and repository updates. Always loads the shared edit guardrails
  support skill before edits. Do not use for end-user demo package creation.
metadata:
  version: "1.4.0"
---

## Purpose

Use this support skill only when a repository maintainer or skill creator asks to update, install,
validate, split, or publish the Scout demo-builder skill and related support files.

Do not load or expose these maintenance instructions during ordinary end-user demo package creation.
End-user demo workflows use `scout/demo-builder-SKILL.md`.

Before editing any Scout or Cowork demo-builder skill, support skill, or companion reference, load
the shared edit guardrails support skill and follow its cross-skill parity checks.

## Canonical source

- **Public repository:** `https://github.com/rob-foulkrod/mtt-demo-creation-tools`
- **Scout runtime skill:** `https://raw.githubusercontent.com/rob-foulkrod/mtt-demo-creation-tools/main/scout/demo-builder-SKILL.md`
- **Scout creator maintenance support skill:** `https://raw.githubusercontent.com/rob-foulkrod/mtt-demo-creation-tools/main/scout/demo-builder-creator-maintenance-SKILL.md`
- **Shared edit guardrails support skill:** `https://raw.githubusercontent.com/rob-foulkrod/mtt-demo-creation-tools/main/Common/demo-builder-edit-guardrails-SKILL.md`
- **Cowork format reference:** `https://raw.githubusercontent.com/rob-foulkrod/mtt-demo-creation-tools/main/cowork/demo-builder-SKILL.md`
- **Demo Builder Generate Data folder:** `https://github.com/rob-foulkrod/mtt-demo-creation-tools/tree/main/Common/demo-builder-generate-data`
- **Change logs folder:** `https://github.com/rob-foulkrod/mtt-demo-creation-tools/tree/main/change%20logs`

Use only the public GitHub repository above as the source of truth for skill source files, support
skills, references, demo-builder-generate-data files, change logs, updates, and documentation. Do not use a
personal SharePoint, OneDrive, Teams file, internal catalog, or private folder as a canonical source.

## Demo Builder Generate Data dependency maintenance

- **Required version:** `2026.09.16.1` or newer.
- Install the `demo-builder-generate-data` skill as a complete folder containing `SKILL.md`, `companies.csv`, and
  `names.csv`.
- When downloading directly, use the raw files from:
  1. `https://raw.githubusercontent.com/rob-foulkrod/mtt-demo-creation-tools/main/Common/demo-builder-generate-data/SKILL.md`
  2. `https://raw.githubusercontent.com/rob-foulkrod/mtt-demo-creation-tools/main/Common/demo-builder-generate-data/companies.csv`
  3. `https://raw.githubusercontent.com/rob-foulkrod/mtt-demo-creation-tools/main/Common/demo-builder-generate-data/names.csv`

## Local file validation

- **Scout skill path:** the Scout skills root selected or configured by the user, with the skill at `demo-builder/SKILL.md`.
- **Demo Builder Generate Data skill folder:** the same Scout skills root, with the dependency installed at `demo-builder-generate-data/`.
- Before running a maintenance update, validate that the Scout skill local path exists and that the
  demo-builder-generate-data folder contains `SKILL.md`, `companies.csv`, and `names.csv`.
- If any required local file is missing, offer to download and install it from the full public GitHub
  URL before continuing.
- If the maintainer provides a different Scout skills root, validate that path instead and
  report the exact path used.

## Change log requirement

- Every update to the Scout runtime skill or this support skill must write a change log file in
  `https://github.com/rob-foulkrod/mtt-demo-creation-tools/tree/main/change%20logs`.
- Name each Scout runtime change log `scout-demobuilder-<skill-version>-log.md`; for runtime version
  `2026.09.16.1`, use `scout-demobuilder-2026.09.16.1-log.md`.
- The runtime change log title must be `scout-demobuilder <skill-version>-log`.
- Keep `Skill name` as the registered name `demo-builder`, and include an `Environment` section set
  to `Scout`.
- This support skill's own logs continue using `<skill-name>-<skill-version>-log.md`.
- The change log must include `Skill name`, `Environment` for runtime logs, `Skill version`,
  `Additions`, and `Deletions` sections.
  If there are no deletions, write `None`.
- Commit the change log file in the same commit as the skill update.

## Updating the Scout runtime skill

When the user asks to update the Scout demo-builder skill:

1. Read the canonical runtime skill and Cowork runtime skill before editing.
2. Load the shared edit guardrails support skill and apply its parity, source-of-truth, and
   regression checks before changing files.
3. Increment the date-style version in both frontmatter `metadata.version` and the `Version:` line.
4. Keep end-user runtime instructions in `scout/demo-builder-SKILL.md`.
5. Move creator-only maintenance material into this support skill.
6. Keep Scout's GitHub-ready and non-GitHub/Cowork-compatible branches intact unless the user
   explicitly requests a branch behavior change.
7. Write the required change log file for the new version.
8. Apply the change to the active personal skill when requested, then validate and score it.
9. Commit the identical validated runtime `SKILL.md`, support skill updates, and change log changes
   back to `https://github.com/rob-foulkrod/mtt-demo-creation-tools`.
10. Read the saved canonical files again from GitHub and verify that their versions and content
    match before reporting completion.
