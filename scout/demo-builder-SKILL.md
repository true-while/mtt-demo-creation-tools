---
name: demo-builder
description: |
  Builds public-safe demo packages for MTT private deliveries and first asks, "Will you
  be uploading to GitHub?" Routes Yes to a GitHub-ready repository package and No to a
  Cowork-compatible overview Page plus `demo/` folder. Use when the user asks to "create a demo on
  demand", "build an MTT demo package", "make a Scout, Cowork, Copilot, Agent Builder, SharePoint
  agent, or Copilot Studio demo", "prepare a public GitHub demo repo", or "create demo artifacts
  for a private delivery". Do NOT use for confidential customer data or an MTT idea or initiative.
  Do NOT use for a standalone document - use docx instead; a standalone spreadsheet - use xlsx
  instead; or a deck or slide - use pptx instead.
metadata: {version: "2026.09.16.1"}
---

Use this skill when an MTT wants to create a demo package for a private delivery. The package must be generated from the user's current requirements and must not copy proprietary or copyrighted material from prior examples.

Skill version:
Version: 2026.09.16.1

Source and bundled dependencies:
- Public repository: `https://github.com/rob-foulkrod/mtt-demo-creation-tools`
- Data dependency: bundled `demo-builder-generate-data` skill, including `companies.csv` and `names.csv`.
- Style dependency: bundled `demo-builder-style-guidelines` skill.

Use the installed skills and companions from this release. Resolve each skill by its registered name
and host-provided location; do not assume a filesystem root or fetch replacement instructions.
The public GitHub repository is the source of truth, not any private folder, catalog, or shared file.

Demo Builder Generate Data dependency:
- Before creating any fictional company, person, email address, or sample data, load the bundled `demo-builder-generate-data` skill.
- Do not inspect `demo-builder-generate-data`'s companion directory from this skill. That skill owns validation and reading of its own `companies.csv` and `names.csv` files.
- If `demo-builder-generate-data` reports missing, empty, malformed, or unusable companion data, follow its documented stop or role-placeholder fallback behavior. Do not invent replacement names or silently download files.

Core purpose:
Create a complete, public-safe demo package containing presenter instructions and supporting files for Microsoft technology demos tailored to an industry, role, fictional customer scenario, and realistic business workflow. The workflow must branch based on whether the user wants a public GitHub upload.

## When to Use

- "Create a demo on demand" or "build an MTT demo package."
- "Make a Scout, Cowork, Microsoft 365 Copilot, Agent Builder, SharePoint agent, or Copilot Studio demo."
- "Prepare a public GitHub demo repository."
- "Create a Cowork-compatible demo folder."
- "Build repeatable presenter instructions and supporting artifacts for a private delivery."

## When NOT to Use

- Confidential customer or tenant data, private URLs, credentials, or real customer-specific
  records.
- A standalone Word document -> use the **docx** skill.
- A standalone spreadsheet -> use the **xlsx** skill.
- A standalone slide deck -> use the **pptx** skill.
- An MTT idea or initiative -> use the **mtt-initiative-creator** skill.
- General GitHub repository work that is not an MTT demo package.

Required first prompt:
Before collecting GitHub account, repository name, staging location, or destination folder, ask exactly: "Will you be uploading to GitHub?" Provide Yes and No choices. If the user already clearly answered Yes or No in the current request, record that answer and do not repeat the question.

Branching rules:
- If the user answers Yes, follow the GitHub-ready repository workflow. Require GitHub owner/account or organization and exact repository name. Build a public GitHub-ready package, preserve all download links, include demo instructions in both Markdown and Word, and use the shared `demo/` folder structure so all demo artifacts live under `demo/sample-data/`.
- If the user answers No, do not ask for GitHub account, organization, or repository name. Use the Cowork-compatible package workflow and file format: one scenario-named `.page` at the package root, one `demo/` folder, `demo/DEMO-INSTRUCTIONS.docx`, and `demo/sample-data/` containing every sample, grounding, imported, attached, opened, media, configuration, or supporting artifact. Do not create README.md, Markdown files, manifest files, `.github/`, LICENSE, GitHub repository scaffolding, or repository metadata unless the user later explicitly changes the answer to Yes.

Required intake workflow:
1. Ask: "Will you be uploading to GitHub?" with Yes/No choices unless the user already clearly answered it in the current request. Never re-ask an answered branch question.
2. Ask for the target industry, business scenario, and primary role or persona the demo should serve.
3. Ask whether they have a public customer web page, company web page, industry page, or role description to use as inspiration. Make clear this is optional and will only be used to infer public, non-confidential themes; the final demo must use a fictional Microsoft Fake Company, not the real customer name or data.
4. Prompt the user to choose the demo technology focus from these options, allowing combinations when appropriate: Microsoft 365 Copilot, Copilot prebuilt agents, Cowork, Microsoft Scout, a Custom Agent in Microsoft 365 Agent Builder, a SharePoint agent, Agent Builder in Chat, or Copilot Studio.
5. Ask for starting experience and build/use scope: for example Microsoft 365 Copilot Chat, Copilot Studio, SharePoint agent, Agent Builder, Scout, Cowork, or another exact app/agent experience; and whether the demo builds/configures something, uses an existing experience, or both.
6. Ask for any delivery-specific constraints, persona names, demo length, target audience, required files, required document types, must-show outcomes, or source websites if not already provided.
7. If GitHub upload is Yes, ask for the user's GitHub account or organization, the exact repository name, and whether a local OneDrive staging folder should be created before upload. Tell the user the repository will be created as public and that every generated artifact must be labeled Public before upload.
8. If GitHub upload is No, ask for the destination folder for the Cowork-compatible package and the scenario/package name. If no destination is provided, propose a sensible local or OneDrive staging folder and confirm it.
9. If the prompt is too thin to create a rich demo experience, ask for more detail. If the user has no additional detail, proactively search the web for public, non-confidential information about the industry, role, and broadly comparable company patterns, then use only public and generic insights.

Scenario sufficiency gate:
Before generating files, confirm there is enough information to define:
1. Business task or problem.
2. Persona.
3. Desired outcome.
4. Input or source type.
5. Operation to perform.
6. Expected output.
7. Success conditions.
If any are missing, ask only for the missing details or propose reasonable synthetic assumptions for approval.

Research and scenario-building workflow:
1. Always research or look up the target industry, role or persona, and company context before generating artifacts. Prefer sources the user provides; otherwise use public web sources for industry norms, vocabulary, business workflows, KPIs, regulatory context, and role responsibilities.
2. When the user provides a real company, use it only for public inspiration. The package must use a fictional Microsoft Fake Company with synthetic data and must not use real company names in sample records, screenshots, prompts, internal process names, financials, employee names, customer names, or metrics.
3. Create a concrete end-to-end workflow for the demo showing multiple inputs, handoffs, decisions, and outputs.
4. Prefer multi-artifact experiences. Use more than one document, spreadsheet, data file, prompt set, or configuration file when that better demonstrates how Copilot or an agent reasons across multiple inputs.
5. Record public source URLs and assumptions. For GitHub packages, cite them in README.md, DEMO-INSTRUCTIONS.md, and manifest.json. For non-GitHub packages, cite them in the overview `.page` and DEMO-INSTRUCTIONS.docx.
6. If public web research is unavailable or blocked, continue with clearly identified synthetic assumptions and document them in the appropriate overview and instructions files.

Public-data and privacy rules:
1. Never use confidential customer data, private tenant details, internal URLs, real people, or real customer-specific metrics.
2. If a real customer web page is provided, use it only as public inspiration for industry vocabulary, business priorities, and plausible use cases.
3. Replace the customer with a fictional Microsoft Fake Company. The fictional company name must be clearly artificial and must not imply endorsement by or affiliation with any real organization.
4. Include this disclaimer prominently in README.md and DEMO-INSTRUCTIONS.md for GitHub packages, and in the overview `.page` and DEMO-INSTRUCTIONS.docx for non-GitHub packages: "This demo uses a fictional Microsoft Fake Company created for demonstration purposes. Any resemblance to real organizations, people, products, services, or data is coincidental. Do not use customer confidential information in this package."
5. Label every generated artifact as Public where the format supports it. At minimum, include "Classification: Public" near the top of README.md, DEMO-INSTRUCTIONS.md, AI-CONTENT-DECLARATION.md, overview `.page`, generated supporting markdown, CSV, JSON, sample data, prompt, or configuration files. For binary or media artifacts, include a companion entry in the README/manifest or overview/instructions marking them Public.
6. Before creating a public repository or uploading anything visible to others, show the user a concise preview of generated contents and the exact public classification/disclaimer approach. Require explicit approval before public upload.

Always do:
1. Before creating documents, workbooks, presentations, Pages, diagrams, images, or styled artifacts, load the bundled `demo-builder-style-guidelines` skill from the same release. Define one shared package style system before artifact creation and apply it to every related file where the format supports styling. The style system must cover at least three complementary colors, fonts, title treatment, heading hierarchy, table styles, header bands, row banding, borders, column widths, number formats, date formats, chart styling, terminology, and scenario naming across Excel, Word, PowerPoint, Markdown, CSV, JSON, and supporting artifacts.
2. Style every worksheet and secondary sheet deliberately. Every Excel sheet must have a meaningful title, filled header band, consistent font and palette, readable column widths, frozen headers, appropriate typed number/date formats, and charts or summaries when they support the scenario. Review related artifacts side by side before upload or publication to confirm visual and terminology consistency.
3. Always research what the target data should look like before generating sample records. Use realistic industry fields, identifiers, statuses, date ranges, units of measure, relationships, and data volumes for the selected scenario and country or region.
4. Use the scenario locale. Format currencies, dates, percentages, phone numbers, postal codes, separators, addresses, and measurements according to the scenario geography. Use `$` for United States currency or the correct symbol/code for other countries or regions. Store currency, dates, percentages, and derived numeric values as typed values where the file format supports them; do not embed formatted money or dates as plain text when Excel or another structured format can store them as typed values.
5. Always invent plausible company, agency, person, product, location, project, and record names. Avoid placeholder names, joke names, obvious test values, repeated names, or file names used as worksheet titles, data values, customer names, agency names, or business content. Recurring entities must use stable IDs and consistent names across files.
6. Preserve cross-file integrity. Names, IDs, dates, amounts, products, statuses, locations, relationships, and handoffs must agree across every related file. Deliberate nonmatching or erroneous records are allowed only when they support a documented filtering, exception, data-quality, reconciliation, triage, or validation step.
7. Never label in-demo prompts, sample records, worksheet data, business documents, ordinary artifact titles, or generated operational artifacts as fictional, fake, synthetic, pretend, dummy, sample-only, test data, or demo content. Those safety concepts belong in public-safety disclaimers, AI transparency sections, README/overview materials, declarations, and manifest-style metadata only. The in-demo data itself should read like credible movie-prop business data while remaining entirely invented and public-safe.
8. When generating data from multiple pretend source systems, organizations, or agencies, include realistic source identifiers and display names. For insurance agency scenarios, include an Agency ID and an Agency Name column with credible invented agency names, and use those fields consistently across matching, reconciliation, and lookup artifacts.
9. Do not add file names, folder paths, prompt labels, generation notes, or authoring metadata to ordinary business datasets unless public research confirms that the real source system genuinely stores that provenance.
10. Do not include silly or self-referential content such as worksheet rows named after the file, fields whose values are just the column name, obvious lorem ipsum, or labels that break the illusion of a real business workflow.

GitHub-ready output structure when GitHub upload is Yes:
Create a local repository folder named after the requested repository with this clean structure by default:
- README.md
- LICENSE
- AI-CONTENT-DECLARATION.md
- manifest.json
- demo/
- demo/DEMO-INSTRUCTIONS.md
- demo/DEMO-INSTRUCTIONS.docx
- demo/sample-data/

GitHub structure rules:
1. Keep all demo artifacts, including Word documents, Excel workbooks, CSV files, JSON files, images, media, grounding content, product configuration files, setup notes, persona cards, diagrams, and expected-result artifacts inside `demo/sample-data/`.
2. Keep presenter instructions in both `demo/DEMO-INSTRUCTIONS.md` and `demo/DEMO-INSTRUCTIONS.docx`. The two files must contain the same human-readable demo instructions.
3. Do not create top-level `artifacts/`, `sample-data/`, `setup/`, `media/`, `screenshots/`, or `prompts/` folders by default. If a product requires machine-readable configuration or media, place it under `demo/sample-data/` using clear subfolders only when helpful.
4. Preserve all download links. README.md and both demo instruction files must link to every file under `demo/sample-data/`. Before upload, use relative links. After GitHub upload, update links to GitHub blob or raw URLs consistently.
5. Include GitHub-only governance files only when appropriate, such as `.github/` issue or pull request templates, but never place demo artifacts outside `demo/sample-data/`.

Cowork-compatible output structure when GitHub upload is No:
Create a package folder named after the scenario with exactly this shape by default:
- <Scenario Name>.page
- demo/
- demo/DEMO-INSTRUCTIONS.docx
- demo/sample-data/

Cowork-compatible structure rules:
1. The package root contains one scenario-named `.page` and one `demo/` folder.
2. `demo/` contains only `DEMO-INSTRUCTIONS.docx` and `sample-data/`.
3. Store every file used, attached, grounded, imported, opened, configured, or referenced during the demo under `demo/sample-data/`.
4. Do not create README.md, DEMO-INSTRUCTIONS.md, AI-CONTENT-DECLARATION.md, LICENSE, manifest.json, `.github/`, repository metadata files, or separate markdown prompt files.
5. The `sample-data/` folder must not be empty. At minimum include a detailed business document or grounding file, a primary structured-data artifact, and an output template or expected-result artifact when applicable.
6. Record actual returned links only; do not invent SharePoint, OneDrive, or file links.
7. If the `.page` pipeline is unavailable, do not silently substitute Markdown or HTML. Report the unavailable Page as a blocker, continue building the approved `demo/` folder when useful, and do not describe the package as complete.

Required README.md content for GitHub packages:
1. Title and fictional Microsoft Fake Company name.
2. Classification: Public.
3. Fictional-company disclaimer.
4. Scenario overview, target industry, target role or persona, and public research basis.
5. Technology focus and prerequisites.
6. Repository contents table.
7. Demo workflow summary showing inputs, actions, outputs, and handoffs.
8. Download links for every supporting artifact under `demo/sample-data/`, plus links to `demo/DEMO-INSTRUCTIONS.md`, `demo/DEMO-INSTRUCTIONS.docx`, manifest, license, and AI-CONTENT-DECLARATION.md. Before upload, use relative links. After GitHub upload, update links to GitHub URLs.
9. Setup instructions.
10. MIT license notice.
11. AI transparency summary with a link to AI-CONTENT-DECLARATION.md.

Required overview `.page` content for non-GitHub packages:
1. Scenario title.
2. Fictional Microsoft Fake Company.
3. Classification: Public.
4. Fictional-company disclaimer.
5. Demo description.
6. Technology focus and exact starting experience.
7. Build/use scope.
8. Persona.
9. Audience.
10. Duration.
11. Prerequisites.
12. Contents links or file references to `demo/DEMO-INSTRUCTIONS.docx` and every file under `demo/sample-data/`.
13. Public research sources.
14. Assumptions.
15. AI transparency notice.

Required DEMO-INSTRUCTIONS content:
For GitHub packages, create both `demo/DEMO-INSTRUCTIONS.md` and `demo/DEMO-INSTRUCTIONS.docx`. For non-GitHub packages, create only `demo/DEMO-INSTRUCTIONS.docx`.

The presenter guide must use this clean structure:
1. Demo title.
2. Scenario: concise paragraph describing the task and desired outcome.
3. Demo Tool: exact app, exact agent or experience, and whether this is build, use, or both.
4. Files to Attach: bulleted list of files in execution order, all located under `demo/sample-data/`.
5. Prompts: numbered prompts. Each prompt must include exact prompt text, sources/files used, required result format, acceptance criteria, next handoff, failure behavior where relevant, and expected output.
6. Build or Configure, optional when the demo requires setup.
7. Test and Validate, optional but recommended for agent or workflow demos.
8. Cleanup steps where needed.

GitHub `DEMO-INSTRUCTIONS.md` and `DEMO-INSTRUCTIONS.docx` must also include readable download links or file references for every supporting file. In Word, use readable hyperlinks or path references.

Presenter guide visual standard:
1. Use a clean, printable white page with one restrained accent color, a single professional sans-serif font, real Heading 1 and Heading 2 styles, generous whitespace, short paragraphs, and simple bullets.
2. The default presenter guide must be one or two pages. Build-heavy SharePoint agent, Agent Builder, and Copilot Studio demonstrations may exceed two pages only when the extra space contains required current-interface build steps, permission checks, test prompts, expected results, and acceptance criteria.
3. Put every exact copy-and-paste prompt in a shaded, bordered, single-cell prompt box. Each prompt box must include the files or knowledge sources in use, required result format, pass criteria, failure or no-match behavior where relevant, and the next handoff.
4. Do not add a cover page, table of contents, executive summary, package inventory, long talk track, timing table, repeated disclaimer, or overview material unless the user explicitly requests it.
5. Put `Classification: Public` unobtrusively in the footer, document properties, or an appropriate metadata location rather than repeating it throughout the body.
6. Visually inspect every rendered page before publication or upload.
7. Apply this clarity check before completion: an MTT must be able to immediately identify the scenario, exact tool or agent, exact files and loading locations, and prompt execution order.

Required AI-CONTENT-DECLARATION.md content for GitHub packages:
1. Classification: Public.
2. Statement that the repository contains AI-generated and human-reviewed demo content.
3. Confirmation that all sample data, personas, company names, metrics, and documents are fictional unless explicitly identified as public source references.
4. Summary of public sources used, if any.
5. Reminder not to add customer confidential information to the repository.

Rich artifact requirements:
Before creating sample data, business documents, templates, slides, workbooks, diagrams, images, or visual outputs, load the shared style guidelines support skill and apply it with the data-quality requirements below.

1. Word documents must be substantive, polished business documents, not placeholders. A generated Word document should normally be a few pages long and include relevant headings, executive context, scenario details, tables or structured sections, and realistic fictional content.
2. Detailed SOPs, playbooks, and procedural documents must be several pages long and cover purpose, scope, roles, prerequisites, procedures, decision points, exceptions, controls, validation, troubleshooting, and expected outcomes.
3. Excel workbooks used as a primary dataset must include more than one worksheet. For GitHub packages, include at least 100 fictional data rows unless the scenario requires more. For non-GitHub/Cowork-compatible packages, require at least 1,000 rows for primary structured datasets. Include calculations/formulas, lookup/reference tabs, summaries, and charts where useful.
4. At least 50% of each primary source dataset must match the intended criteria. Include meaningful nonmatches such as other regions, dates, stages, categories, products, owners, risk levels, or conditions so the presenter must filter and reason over the data. Verify and document matching and nonmatching counts in the branch-appropriate overview or instruction materials.
5. Derived Excel values must use live formulas where Excel supports them, and formula results must be checked for errors before completion.
6. CSV or JSON files must contain enough realistic synthetic records to support analysis, filtering, summarization, or agent grounding.
7. Every major demo step must define the exact input, action or prompt, expected result, pass criteria, failure or no-match behavior, and next handoff.
8. Include matching and nonmatching records, verified counts, and testability for major steps when the scenario depends on data matching, reconciliation, triage, or validation.
9. Include charts, diagrams, or visual summaries where useful. Place any exported images or media under `demo/sample-data/`.
10. Every artifact must serve the demo workflow. Do not add filler files solely to increase artifact count.

Technology guidance:
1. Microsoft 365 Copilot demos should focus on prompts, workflow orchestration, content generation, summarization, analysis, and meeting/email/document productivity across multiple rich inputs.
2. Copilot prebuilt agent demos should clearly identify which prebuilt agent is being demonstrated and provide realistic setup, usage instructions, expected inputs, and expected outputs.
3. Cowork demos should include collaboration workflow steps, prompts, expected handoffs, and how to show value in a private delivery.
4. Microsoft Scout demos should include Scout-oriented prompts, scenario walkthroughs, expected outputs, and safe sample artifacts.
5. M365 Agent Builder, Agent Builder in Chat, or SharePoint custom agent demos should include agent purpose, grounding files, instructions, starter prompts, test cases, acceptance criteria, and deployment/setup guidance.
6. Copilot Studio demos should include topic/agent design notes, sample trigger phrases, actions/connectors placeholders if needed, test scripts, fallback behavior, and sample data or documents that make the conversation realistic.

Licensing for GitHub packages:
Always create an MIT LICENSE file using the current year and the GitHub account or organization provided by the user as copyright holder unless the user specifies another public-safe copyright holder.

GitHub upload workflow when GitHub upload is Yes:
1. Do not create the public repository or upload artifacts until the user explicitly approves the generated artifacts and confirms they are public-safe.
2. Require both the user's GitHub account or organization and the exact repository name before upload.
3. Create a new public GitHub repository using the provided account or organization.
4. Prefer GitHub CLI if available and authenticated. Recommended command pattern: `gh repo create <owner>/<repo-name> --public --source . --remote origin --push` from inside the generated repository folder.
5. If the GitHub repository already exists, stop and ask the user whether to choose a different repository name or use the existing repository; do not overwrite an existing repository without explicit approval.
6. Upload all generated artifacts to the public repository in the first push.
7. After the first upload, update README.md, `demo/DEMO-INSTRUCTIONS.md`, and `demo/DEMO-INSTRUCTIONS.docx` so every supporting artifact has a GitHub download link.
8. Commit and push the link update after repository creation.
9. If GitHub CLI is not available or not authenticated, try standard git commands if a remote repository can be created or provided. If public repository creation is not possible in the current environment, leave a complete local repository and provide exact commands for the user to create the public repo and upload all artifacts.

Demo logging:
1. Do not log newly created demos to a shared catalog, SharePoint folder, workbook, list, or other tracking destination.
2. Demo logging is intentionally deferred until a future logging process is selected.
3. Use the public GitHub repository page `https://github.com/rob-foulkrod/mtt-demo-creation-tools` as the source for demo-builder skill updates and documentation.
4. After a GitHub demo package is published, report only the created repository URL and generated package contents. Do not create or update any separate catalog row.

Non-GitHub upload/verification workflow when GitHub upload is No:
1. Preview the package before writing or uploading: technology scope, starting experience, build/use scope, destination, root structure, sample-data contents, prompt sequence, sources, assumptions, and classification/disclaimer approach.
2. Require user approval before uploading to a shared SharePoint or OneDrive destination.
3. Create the package folder, overview `.page`, `demo/DEMO-INSTRUCTIONS.docx`, and all substantive sample artifacts under `demo/sample-data/`.
4. Upload or save files to the approved destination.
5. Verify final contents by re-listing the package structure and comparing against the expected checklist.
6. Report actual links returned by tools. Do not invent links.

Demo archive and deletion workflow:
1. If an MTT asks to delete, remove, retire, or archive a demo, first clarify whether they want to delete or archive the public GitHub repository, delete local generated files, remove generated destination files, or all of the above.
2. Never delete a public GitHub repository, local folder, or SharePoint file without explicit confirmation that names the target repository or file.
3. If the repository should remain but no longer be promoted, keep the repository and tell the user demo logging/catalog updates are not currently maintained by this skill.
4. If the repository should be deleted, confirm the exact `owner/repository` name, clearly state that repository deletion is irreversible, obtain explicit confirmation naming that target, and use GitHub CLI when authenticated.
6. If the local generated package folder should be deleted, confirm the exact local path before deleting it.
7. If a demo's own `manifest.json` is being updated during archive or deletion, set a repository-level status field when present or add one if needed, then commit and push that status update before any repository deletion.

Quality bar:
1. The package must be complete enough for an MTT to run the private delivery without asking for missing scripts or files.
2. Use clear, executive-friendly language and demo-step precision.
3. Keep fictional content realistic but not real-customer specific.
4. Confirm the GitHub upload branch before asking for GitHub account, organization, or repository name.
5. Validate that every generated file uses the correct branch-specific structure.
6. Validate that one shared style system was defined before artifact creation and applied across related files, including fonts, palette, headings, tables, borders, widths, date and number formats, terminology, and scenario naming.
7. Validate that every worksheet and secondary sheet has deliberate formatting and that related artifacts were reviewed side by side for consistency.
8. Validate that GitHub packages include README.md, LICENSE, AI-CONTENT-DECLARATION.md, manifest.json, `demo/DEMO-INSTRUCTIONS.md`, `demo/DEMO-INSTRUCTIONS.docx`, and all demo artifacts under `demo/sample-data/`.
9. Validate that non-GitHub packages contain one `.page`, one `demo/` folder, `demo/DEMO-INSTRUCTIONS.docx`, and non-empty `demo/sample-data/`, with no Markdown or repository files.
10. Validate that all generated files include Public classification where applicable and the required disclaimer is present in branch-appropriate overview and instruction files.
11. Validate that GitHub README.md, `demo/DEMO-INSTRUCTIONS.md`, and `demo/DEMO-INSTRUCTIONS.docx` include download links or readable file references for every supporting artifact after upload.
12. Validate that Word documents are substantive and a few pages long where Word documents are part of the demo; detailed SOPs and procedural documents must cover purpose, scope, roles, prerequisites, procedures, decision points, exceptions, controls, validation, troubleshooting, and expected outcomes.
13. Validate that the Word presenter guide uses the required clean one-to-two-page default, real heading styles, shaded single-cell prompt boxes, no unrequested cover/table-of-contents/package-inventory/long-talk-track/repeated-disclaimer content, and rendered-page visual inspection.
14. Validate that the presenter guide clarity check passes: scenario, exact tool or agent, exact files and loading locations, and prompt execution order are immediately visible.
15. Validate that Excel workbooks have multiple sheets and branch-appropriate row counts: at least 100 rows for GitHub primary datasets unless the scenario requires more, and at least 1,000 rows for non-GitHub/Cowork-compatible primary datasets.
16. Validate that locale-specific typed dates, currency values, percentages, phone formats, addresses, separators, and units are used where the format supports them.
17. Validate that recurring entities have stable IDs and that names, dates, amounts, statuses, locations, relationships, and handoffs remain consistent across files.
18. Validate that business datasets exclude file names, folder paths, prompt labels, generation notes, and authoring metadata unless public research confirms that the real source system stores that provenance.
19. Validate that at least 50% of every primary source dataset matches the intended criteria, with meaningful nonmatches and verified matching/nonmatching counts.
20. Validate that derived Excel values use live formulas and that formula results have been checked for errors.
21. Validate that every major demo step defines the exact input, action or prompt, expected result, pass criteria, failure or no-match behavior, and next handoff.
22. Validate that prompts and human-readable instructions are consolidated in the branch-appropriate instruction files and prompt text is shown in clearly labeled boxes.
23. Validate that package-level disclosure remains present while provenance language stays out of prompts, business records, entity names, and ordinary artifact titles.
24. Validate that no separate demo catalog, SharePoint logging file, workbook, or list was created or updated.
25. Do not create or store secrets, credentials, tenant IDs, private URLs, or customer confidential content.

## Guardrails

- **Required branch question:** Always ask "Will you be uploading to GitHub?" before requesting
  GitHub details, a staging location, or a non-GitHub destination, unless the user has already
  clearly answered Yes or No in the current request. Never repeat an answered branch question.
- **Explicit scope confirmation:** Confirm the technology, starting experience, and whether the
  demonstration builds, configures, uses, or combines an agent or product experience.
- **Scenario sufficiency:** Do not generate files until the business task, persona, inputs,
  operation, expected output, and success conditions are defined or the user approves clearly
  labeled assumptions.
- **Public-safe content only:** Never use confidential customer data, real tenant details, private
  URLs, credentials, secrets, real people, or customer-specific metrics.
- **GitHub-only skill source:** Use `https://github.com/rob-foulkrod/mtt-demo-creation-tools` as
  the only source of truth for this skill, the Cowork reference, demo-builder-generate-data files, change logs,
  updates, and documentation. Never use or cite a personal SharePoint, OneDrive, Teams file,
  internal catalog, or private folder as the canonical skill source.
- **Shared style system required:** Do not create artifacts until one shared style system is defined,
  then apply and verify it across every related file where the format supports styling.
- **Never fabricate real facts:** Use researched public patterns and invented demo content. Do not
  present invented names, dates, figures, URLs, customer details, or product capabilities as real.
- **Cross-file integrity required:** Stable entity IDs, names, dates, amounts, statuses, locations,
  products, relationships, and handoffs must remain consistent across related files unless a
  documented exception supports a validation step.
- **Typed locale values required:** Currency, dates, percentages, and derived values must be typed
  values where supported, with scenario-appropriate symbols, separators, address patterns, phone
  formats, and units.
- **Approval before visible writes:** Preview the exact package, destination, classification, and
  disclaimer approach before creating a public repository or uploading to a shared folder.
- **No silent overwrite:** If a repository, package, or destination item already
  exists, identify it and obtain explicit direction before replacing or reusing it.
- **Destructive actions require named confirmation:** Never delete or permanently remove a
  repository, package, file, or folder without explicit confirmation naming the
  exact target. Prefer archive or retired status where possible.
- **Branch fidelity:** GitHub packages must contain the complete repository structure and download
  links. Non-GitHub packages must contain the overview Page and clean `demo/` structure without
  repository files.
- **No placeholder deliverables:** Final artifacts must contain substantive demo content or
  transparently report the remaining gap.
- **Presenter guide controls required:** The guide must follow the clean one-to-two-page default,
  real heading styles, shaded single-cell prompt boxes, rendered-page visual inspection, and clarity
  check. Do not add cover pages, tables of contents, package inventories, long talk tracks, repeated
  disclaimers, or overview content unless explicitly requested.
- **No empty sample-data folder:** `demo/sample-data/` must contain substantive runnable inputs,
  grounding content, or configuration, plus an output template or expected-result artifact when the
  workflow produces a deliverable.
- **Dataset composition required:** Primary source datasets must include meaningful matching and
  nonmatching records, at least 50% matches for the intended criteria, verified counts, and live
  formula validation where derived Excel values exist.
- **No generic generated identities:** Do not use numbered fictional-customer labels, `Sample`,
  `Test`, `Fake`, or `Demo` as business entity names.
- **No implementation columns:** Do not add file names, folder paths, prompt names, generation
  notes, or authoring metadata to business datasets unless public research confirms that the real
  system stores those fields.
- **Step acceptance criteria required:** Every major step must define exact input, action or prompt,
  expected result, pass criteria, failure or no-match behavior, and next handoff.
- **Transparency stays outside records:** Keep Public classification, AI transparency, and the
  Microsoft Fake Company disclaimer in README/overview/governance materials; do not put fictional,
  fake, synthetic, sample, test, or demo labels inside ordinary business records, entity names, or
  copy-and-paste prompts.
- **Completion requires verification:** Re-list or inspect every final destination and do not
  report success while files, links, classifications, or required artifacts are
  missing.

When invoked, begin with the GitHub upload question unless the user already answered it in the current request. Ask only for missing fields after that branch is known. Research the industry, role, and company context; build a realistic multi-input workflow; generate the branch-appropriate local package; present a preview for approval; and then either publish to GitHub and report the created repository URL without logging it elsewhere, or save/upload the Cowork-compatible package and verify the final structure before reporting the workflow complete.
