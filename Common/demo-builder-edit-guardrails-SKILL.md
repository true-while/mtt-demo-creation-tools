---
name: demo-builder-edit-guardrails
description: |
  Creator-only edit guardrails for maintaining Scout and Cowork demo-builder skills. Load before
  editing either runtime skill, support skill, or companion reference to keep behaviour, quality,
  safety, publishing, and verification requirements aligned.
metadata:
   version: "1.0.4"
---

## Purpose

Use this support skill before editing any file that affects the Scout or Cowork demo-builder
experience in `https://github.com/rob-foulkrod/mtt-demo-creation-tools`.

Do not use this skill for ordinary end-user demo package creation. End-user workflows use the
runtime demo-builder skills and their runtime references.

## Canonical source

- **Public repository:** `https://github.com/rob-foulkrod/mtt-demo-creation-tools`
- **Scout runtime skill:** `https://raw.githubusercontent.com/rob-foulkrod/mtt-demo-creation-tools/main/scout/demo-builder-SKILL.md`
- **Cowork runtime skill:** `https://raw.githubusercontent.com/rob-foulkrod/mtt-demo-creation-tools/main/cowork/demo-builder-SKILL.md`
- **Shared edit guardrails:** `https://raw.githubusercontent.com/rob-foulkrod/mtt-demo-creation-tools/main/Common/demo-builder-edit-guardrails-SKILL.md`
- **Demo Builder Generate Data folder:** `https://github.com/rob-foulkrod/mtt-demo-creation-tools/tree/main/Common/demo-builder-generate-data`
- **Change logs folder:** `https://github.com/rob-foulkrod/mtt-demo-creation-tools/tree/main/change%20logs`

Use only the public GitHub repository above as the source of truth. Never use a personal SharePoint,
OneDrive, Teams file, internal catalog, or private folder as a canonical source for skill code,
references, support skills, generated examples, documentation, or change logs.

## Mandatory edit workflow

1. Read the current Scout runtime skill, Cowork runtime skill, relevant support skills, and relevant
   companion references before editing.
2. Identify whether the change is end-user runtime behavior, creator-only maintenance behavior,
   shared quality/safety behavior, documentation, or generated-data compliance behavior.
3. Keep creator-only material out of end-user runtime skills. Versioning, local installation,
   repository maintenance, publishing the skill repository, and change-log procedure belong in
   creator-only support skills.
4. Keep shared rules shared. If a safety, quality, data, artifact, disclosure, approval, or
   verification requirement applies to both Scout and Cowork, update both runtime paths or move the
   requirement into a shared reference and make both skills load it.
5. Preserve intentional product differences. Scout may ask whether the package will be uploaded to
   GitHub and supports GitHub-ready and Cowork-compatible branches. Cowork remains folder-native and
   must not prepare GitHub repositories.
6. Keep source references public and GitHub-only. Do not introduce SharePoint, OneDrive, Teams, or
   private URLs as skill source-of-truth references.
7. Do not introduce user-specific absolute paths or machine-specific install locations. Use
   product-relative paths such as `/Documents/Cowork/skills/{skill-name}` for Cowork and generic
   Scout skills-root wording for Scout.
8. Update `metadata.version` and change logs in the same commit when a skill or support skill changes.
9. Update README installation and repository-layout guidance when files are added, moved, renamed, or
   split.
10. Update installed local copies only when the user asks or when the current task is explicitly to
   keep the user's local skill aligned with GitHub.
11. After pushing, read back the canonical GitHub files or commit metadata and verify that the branch
    contains the intended versions and files.

## Environment-qualified runtime change logs

Scout and Cowork runtime skills share the registered name `demo-builder`. To keep their release
records unambiguous, use an environment-qualified log identity in each runtime changelog filename
and title:

- **Scout runtime:** `scout-demobuilder-<skill-version>-log.md` with title
   `scout-demobuilder <skill-version>-log`.
- **Cowork runtime:** `cowork-demo-builder-<skill-version>-log.md` with title
   `cowork-demo-builder <skill-version>-log`.

Inside both logs, keep `Skill name` as the actual registered name, `demo-builder`, and add an
`Environment` section containing either `Scout` or `Cowork`. Shared and support skills that do not
have separate environment implementations continue using `<skill-name>-<skill-version>-log.md`.

## Cross-skill parity checks

Before committing, verify that both Scout and Cowork still enforce equivalent requirements for:

- Public-safe content only: no confidential customer data, real tenant details, private URLs,
  credentials, secrets, real people, or customer-specific metrics.
- Required fictional Microsoft Fake Company usage and approved demo-builder-generate-data dependency before
  creating fictional companies, people, email addresses, or sample data.
- Public classification and Microsoft Fake Company disclaimer in branch-appropriate overview,
  README, presenter guide, and governance materials.
- Research-based realistic data shape, locale-correct typed values, stable IDs, cross-file
  integrity, non-generic invented identities, and no implementation metadata in business datasets.
- Shared style-guidelines loading before document, workbook, presentation, Page, image, diagram, or
  other styled artifact creation.
- Substantive non-empty `demo/sample-data/` content, branch-appropriate Excel row counts, matching
  and nonmatching records, verified counts, and live formula validation.
- Clean presenter guide with exact files, exact tools or agents, shaded prompt boxes, expected
  outputs, pass criteria, failure or no-match behavior, and next handoff.
- Approval before public repository creation or upload to a shared destination.
- No silent overwrite and named confirmation before destructive actions.
- Final verification by inspecting or re-listing output locations before reporting success.

## Regression checks

Use targeted checks appropriate to the edit:

1. Search for removed or weakened guardrails: `confidential`, `private URL`, `Public`, `Fake Company`,
   `demo-builder-generate-data`, `approval`, `overwrite`, `sample-data`, `verification`, and `SharePoint`.
2. Confirm end-user runtime skills do not expose creator-only update, versioning, local install,
   change-log, or repository-maintenance procedures.
3. Confirm support skills explicitly require this guardrail skill before edits.
4. Confirm no user-specific absolute paths, machine-specific paths, or private local locations were
   introduced.
5. Confirm every new companion reference is one level deep from its skill root unless the platform
   requires otherwise.
6. Confirm line and approximate token limits for any platform with size constraints.
7. Confirm README and change logs mention added, moved, or deleted files, and that runtime logs use
   the required environment-qualified identity.
8. Confirm local installed copies and GitHub source match when local sync is part of the task.
9. If an issue is being addressed, include `Fixes #<number>` or `Refs #<number>` in the commit.
