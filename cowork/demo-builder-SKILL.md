---
name: demo-builder
description: |2
   Builds a clean, public-safe demo package for an MTT private delivery and places it in
  a user-selected OneDrive or SharePoint folder. Produces one polished overview Page plus a
  `demo/` folder containing a concise Word presenter guide and substantive fictional sample data.
  Use when the user asks to "create a demo on demand", "build a demo package", "make a Copilot,
  Scout, Cowork, Agent Builder, SharePoint agent, or Copilot Studio demo", "create demo artifacts
  in a folder", or "prepare a private-delivery demo". Do NOT use for confidential customer data
  or a GitHub-ready repository. Do NOT use for document, docx, or Word-only deliverables - use docx
  instead. Do NOT use for a plain slide or deck - use the built-in pptx instead. Do
  NOT use for an MTT initiative.
metadata: {version: "3.0.0", cowork-category: "automation", cowork-icon: "Rocket"}
---

## Version and Bundled References

- **Current version:** `3.0.0`
- **Public repository:** `https://github.com/rob-foulkrod/mtt-demo-creation-tools`
- **Data dependency:** bundled `demo-builder-generate-data` skill, including `companies.csv` and `names.csv`.
- **Style dependency:** bundled `demo-builder-style-guidelines` skill.
- **Quality standards reference:** [references/QUALITY-STANDARDS.md](references/QUALITY-STANDARDS.md)
- **Presenter guide reference:** [references/PRESENTER-GUIDE.md](references/PRESENTER-GUIDE.md)
- **Technology guidance reference:** [references/TECHNOLOGY-GUIDANCE.md](references/TECHNOLOGY-GUIDANCE.md)

Use the installed skills and companions from this release. Resolve each skill by its registered
name and host-provided location; do not assume a filesystem root or fetch replacement instructions.

## Demo Builder Generate Data Dependency

- Load `demo-builder-generate-data` before creating fictional companies, people, email addresses, or sample data.
- Do not inspect `demo-builder-generate-data`'s companion directory from this skill. That skill owns validation
  and reading of its own `companies.csv` and `names.csv` files.
- If `demo-builder-generate-data` reports missing, empty, malformed, or unusable companion data, follow its
  documented stop or role-placeholder fallback behavior. Do not invent replacement names or silently
  download files.

## Overview

Turn an MTT's private-delivery requirements into a polished, repeatable, public-safe demo stored in
the OneDrive or SharePoint folder the user chooses.

The output is intentionally folder-native rather than repository-shaped. Create one readable
overview Page at the package root and put the runnable demonstration inside a `demo/` folder.
Do not create Markdown documentation, a manifest, a README, GitHub files, or repository
scaffolding. Cowork packages are not prepared or posted as GitHub repositories.

Generate all content fresh from the user's requirements. Never copy proprietary or copyrighted
material from an example.

## ALWAYS Do - Production-Realistic Artifacts

Before creating artifacts, load the shared style guidelines support skill and
[references/QUALITY-STANDARDS.md](references/QUALITY-STANDARDS.md), then apply both to every demo
package. Summary: research the real data shape, define one shared style system with at least three
complementary colors, style every worksheet and document, use locale-correct typed values,
use natural invented identities with stable IDs, keep business data internally coherent, keep
implementation details out of datasets, and keep transparency language at the package level rather
than in business records or prompts.

## When to Use

- "Create a demo on demand" or "build a demo package."
- "Make an MTT private-delivery demo for this industry or role."
- "Build a Microsoft 365 Copilot, Scout, Cowork, Agent Builder, SharePoint agent, or Copilot
  Studio demo."
- "Create the demo artifacts and put them in this OneDrive or SharePoint folder."
- Any request for concise presenter instructions plus realistic fictional supporting assets.

## When NOT to Use

- Real customer names, tenant data, private URLs, confidential material, or customer-specific
  records. This skill creates fictional, Public-classified content only.
- A GitHub repository, README, source tree, or repo-ready demo package.
- A single narrative document -> use the **docx** skill.
- A standalone slide deck -> use the **pptx** skill.
- A spreadsheet without a broader demo package -> use the **xlsx** skill.
- An MTT idea or initiative -> use the **mtt-initiative-creator** skill.

## Output Structure

Create exactly this package shape unless the user explicitly requests a different name:

```text
<Scenario Name>/
|-- <Scenario Name>.page
`-- demo/
    |-- DEMO-INSTRUCTIONS.docx
    `-- sample-data/
        |-- <every file used, attached, grounded, imported, or opened during the demo>
        `-- <optional product-required configuration or media files>
```

Rules:

1. The scenario-named `.page` is the only item at the package root other than `demo/`.
2. `demo/` contains only `DEMO-INSTRUCTIONS.docx` and `sample-data/`.
3. Put every supporting Word document, SOP, workbook, CSV, JSON import, image, grounding file,
   or other runnable demo asset inside `demo/sample-data/`.
4. Do not create `.md` or `.markdown` files anywhere in the package.
5. Do not create `manifest.json`, `README.md`, `AI-CONTENT-DECLARATION.md`, a separate setup
   guide, or a prompt-only file.
6. Do not create `.github/`, source-control files, repository metadata, or instructions for
   posting the package to GitHub.
7. Keep setup directions, file-loading instructions, and prompts in `DEMO-INSTRUCTIONS.docx`.
8. Keep package context, prerequisites, research sources, classification, disclaimer, and AI
   transparency on the overview Page.

## Workflow

### Phase 1 - Collect and confirm the scope

Use `core-AskUserQuestion` to collect missing information in as few cards as practical:

1. Target industry and business scenario.
2. Primary role or persona the demo should serve.
3. Optional public customer, company, industry, or role web page for inspiration. Explain that it
   will be used only for public themes and vocabulary; the demo will use a fictional Microsoft
   Fake Company.
4. Technology focus. Always confirm exactly which technology or technologies the package should
   demonstrate. Offer only relevant choices such as Microsoft 365 Copilot Chat, a named prebuilt
   agent, Cowork, Microsoft Scout, a SharePoint agent, Agent Builder in Chat, or Copilot Studio.
5. Starting experience. Always confirm whether the demonstration begins in Chat, Excel, a named
   agent, or an agent-building experience.
6. Agent scope. When an agent is involved, confirm whether the demo builds the agent, uses an
   existing agent, or does both. Confirm whether it is a SharePoint agent, Agent Builder agent,
   Copilot Studio agent, Scout, Cowork, or a named prebuilt agent.
7. Exact destination folder. Ask whether to use an existing OneDrive or SharePoint folder or
   create a new folder. Never assume the destination.
8. Delivery-specific requirements: audience, duration, persona names, required files, environment
   limits, source websites, and must-show outcomes.

If the conversation already supplies a field, do not ask for it again, except that technology,
starting experience, and build-versus-use scope must always be explicitly confirmed. Never create
versions for every supported product unless the user explicitly confirms that broad scope.

Before researching or creating files, apply a **scenario sufficiency gate**. The request has enough
scenario detail only when it identifies:

1. A concrete business task or problem.
2. The primary persona performing the task.
3. The intended business outcome or handoff.
4. At least one realistic input, source, or grounding-file type.
5. The decision, filter, calculation, transformation, or interaction the technology must perform.
6. The expected output and at least one must-show success condition.

If two or more of these are missing, or the scenario is only a broad label such as "HR onboarding,"
"procurement," or "a demo for my team," use `core-AskUserQuestion` once to request the missing
scenario details. Do not begin research, create artifacts, or create versions for multiple
technologies while the scenario remains light.

If the user has no additional scenario detail after that focused question, research public,
non-confidential patterns and clearly label the resulting workflow and artifact assumptions as
synthetic. Technology, starting experience, agent scope, and destination must still be resolved.

### Phase 2 - Resolve the destination and package root

1. Resolve the supplied folder with `sharepoint_onedrive-SearchDrive`,
   `sharepoint_onedrive-GetDriveChildren`, or the supplied folder link.
2. If several folders are equally plausible, use `core-AskUserQuestion` with the concrete matches.
3. When the user requested a new folder, create it with `sharepoint_onedrive-CreateFolder`.
4. Create one scenario-named package folder beneath the selected destination.
5. Plan an internal expected-file checklist. Do not publish that checklist as a manifest.
6. Record only folder and file links returned by tools. Never invent a link.

### Phase 3 - Research and design the scenario

1. Research the target industry, persona, and company context before generating artifacts. Prefer
   public sources supplied by the user; otherwise use public web sources for vocabulary, common
   workflows, KPIs, regulatory context, and role responsibilities.
2. Use a real company only as public inspiration. Replace it in all sample content with a clearly
   fictional Microsoft Fake Company.
3. Design a concrete end-to-end workflow with multiple inputs, decisions, handoffs, and outputs.
4. Choose only the files that serve the demonstrated workflow. More artifacts are not inherently
   better.
5. Record public sources and synthetic assumptions on the overview Page.
6. If research is unavailable, continue with clearly labeled synthetic assumptions.

### Phase 4 - Create the overview Page

Invoke the **create** skill and use its Page branch to create the single scenario overview Page.
Do not substitute Markdown or a README.

The Page must include:

1. Scenario title and fictional Microsoft Fake Company name.
2. `Classification: Public`.
3. This disclaimer:

   > This demo uses a fictional Microsoft Fake Company created for demonstration purposes. Any
   > resemblance to real organizations, people, products, services, or data is coincidental. Do
   > not use customer confidential information in this demo package.

4. A concise description of what the demo shows and the intended business outcome.
5. Confirmed technology, starting experience, and whether an agent is built, used, or both.
6. Primary persona, delivery audience, and suggested duration.
7. Prerequisites and environment assumptions.
8. A short contents section linking to `demo/DEMO-INSTRUCTIONS.docx` and `demo/sample-data/`.
9. Public research sources and clearly labeled synthetic assumptions.
10. AI transparency: the package contains AI-generated, human-review-ready fictional demo content.
11. A reminder not to add confidential customer information.

Keep the Page polished and concise. It replaces the previous overview, setup guide, manifest, and
AI declaration files.

If the Page pipeline cannot place the `.page` in the requested destination, do not silently create
Markdown or HTML instead. Publish the Page through the available Page pipeline, report its actual
location, and keep the `demo/` folder in the selected destination.

### Phase 5 - Create the clean Word presenter guide

Create `demo/DEMO-INSTRUCTIONS.docx` through the **docx** skill and artifact tools.

Load [references/PRESENTER-GUIDE.md](references/PRESENTER-GUIDE.md) before creating the guide.
Use that specification as the visual, structural, and content-density reference; generate fresh
scenario-specific content. The guide must
normally be one or two clean pages with real heading styles, exact files, numbered shaded prompt
boxes, acceptance criteria, and next handoffs. Do not add cover pages, tables of contents, package
inventories, long talk tracks, repeated disclaimers, or overview content unless explicitly requested.
Visually inspect every rendered page and apply the clarity test before publishing.

### Phase 6 - Create substantive sample data

Create every supporting artifact through the appropriate file skill and artifact tools. Put all
of them in `demo/sample-data/`.

Every demonstration must contain substantive, runnable, scenario-specific supporting artifacts.
An empty `sample-data/` folder, placeholder-only files, external links without local demo inputs,
or a guide that refers to files that were not created fails verification.

Load the shared style guidelines support skill and
[references/QUALITY-STANDARDS.md](references/QUALITY-STANDARDS.md) before creating sample data,
business documents, templates, slides, workbooks, diagrams, images, or visual outputs.
Unless the technology makes one format genuinely inapplicable, include at least one detailed
business document or grounding file, one primary structured-data artifact, and one output template,
destination file, or expected-result artifact when the workflow creates or updates a deliverable.
Excel primary datasets must have at least 1,000 rows and multiple sheets. At least 50% of every
primary source dataset must match the intended criteria, with meaningful nonmatches and verified
counts. Derived Excel values must use live formulas and be checked for errors.

### Phase 7 - Apply technology-specific guidance

Load [references/TECHNOLOGY-GUIDANCE.md](references/TECHNOLOGY-GUIDANCE.md) before writing
product-specific setup, prompts, tests, or expected results. Always name the exact product surface,
agent, attached experience, build/use scope, files, access assumptions, test prompts, expected
outputs, acceptance criteria, fallback or no-match behavior, and next handoff.

### Phase 8 - Preview, approve, upload, and verify

Before uploading, show a concise preview containing:

1. Confirmed technology scope and starting experience.
2. Whether the demo builds an agent, uses one, or both.
3. Resolved destination and scenario package name.
4. The exact two-item root structure: the overview Page and `demo/`.
5. Every file that will appear under `demo/sample-data/`.
6. The exact tool or agent, files, and prompt sequence from `DEMO-INSTRUCTIONS.docx`.
7. Public classification, fictional-company disclaimer, research sources, and assumptions.

Require explicit user approval before uploading because the destination may be visible to others.

After approval:

1. Create the scenario package folder and `demo/sample-data/` with
   `sharepoint_onedrive-CreateFolder`.
2. Upload `DEMO-INSTRUCTIONS.docx` and every supporting artifact with
   `sharepoint_onedrive-UploadFileContent`.
3. Preserve the exact structure.
4. Re-list the package root, `demo/`, and `demo/sample-data/` with
   `sharepoint_onedrive-GetDriveChildren`.
5. Follow pagination until the complete contents are checked.
6. Compare the listing with the internal expected-file checklist and verify that no Markdown,
   manifest, README, or repository file exists.
7. If an upload fails, retry once. If anything is missing or extra, report the exact gap and do
   not describe the package as complete.
8. Report the actual Page and folder links returned by tools.

## Quality Bar

Before reporting completion, load the completion checklist in
[references/QUALITY-STANDARDS.md](references/QUALITY-STANDARDS.md) and verify the package against
it. The runtime summary is: exact Page plus `demo/` structure, no repository files, confirmed scope,
substantive non-empty `sample-data/`, clean presenter guide, researched realistic data, at least
1,000 rows in Excel datasets, at least 50% intended matches with verified counts, live formula
validation, shared styling, package-level transparency, no provenance language in business records,
and verified final uploads.

## Guardrails

- **Fictional and Public only:** Refuse confidential, tenant-specific, or real-customer records.
- **Scope confirmation required:** Always confirm technology, starting experience, and whether an
  agent is built or used. Never create demos for every supported tool without explicit approval.
- **Scenario sufficiency required:** If the request lacks a concrete task, persona, inputs,
  business operation, expected output, or success condition, ask one focused question before
  research or creation.
- **Clean guide required:** Use the bundled reference and do not expand the Word guide into a
  handbook. Build-heavy guides may be longer only for required setup, permissions, tests, and
  acceptance criteria.
- **Page, not Markdown:** Never substitute a Markdown README for the overview Page.
- **No repository package:** Do not prepare, scaffold, or post the demo as a GitHub repository.
- **Destination required:** Resolve the exact OneDrive or SharePoint folder before uploading.
- **Approval before upload:** Preview the complete Page and folder structure, then obtain explicit
  approval before writing to the shared destination.
- **No silent overwrite:** If a destination file or package already exists, identify it and obtain
   explicit direction before replacing or reusing it.
- **Destructive actions require named confirmation:** Never delete a package, file, or folder
   without explicit confirmation naming the exact target.
- **No secrets:** Never create or store credentials, tokens, tenant IDs, or private URLs.
- **No fabricated links:** Use only Page, folder, and file links returned by tools.
- **No placeholder deliverables:** Final artifacts must contain substantive demo content or
  transparently report the remaining gap.
- **No empty sample-data folder:** At least one substantive input or grounding artifact is always
  required, with an output or expected-result artifact when the workflow produces a deliverable.
- **No inconsistent styling:** Do not publish related files until every file and every sheet has
  been checked against the shared style system.
- **No generic generated identities:** Do not use numbered fictional-customer labels, `Sample`,
  `Test`, `Fake`, or `Demo` as business entity names.
- **No implementation columns:** Do not add file names, folder paths, prompt names, or authoring
  notes to business datasets unless public research confirms that the real system stores them.
- **Transparency stays outside the records:** Never remove the Public classification, AI
  transparency, or Microsoft Fake Company disclaimer from the overview Page, and never imply that
  invented records are real customer or operational data.
- **Verify every upload:** Re-list all three levels and compare them with the internal expected-file
  checklist before reporting success.
