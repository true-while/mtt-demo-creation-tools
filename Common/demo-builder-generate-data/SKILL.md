---
name: demo-builder-generate-data
description: >
  REQUIRED whenever synthetic, fake, or sample content will contain a COMPANY NAME or PERSON NAME.
  Microsoft legal policy permits only CELA-approved fictitious names, and this skill carries the approved lists.
  Use when the user says "generate fake data", "create synthetic/sample data", "build a demo dataset",
  "make sample files", "dummy/mock/test data", "CIE or Copilot demo examples", "courseware or class demo pack",
  "invent a fictional company/customer/employee", or "/demo-builder-generate-data". Covers Excel, Word, PowerPoint and CSV. Load this BEFORE inventing any company or person name, including when the
  data is a supporting artifact of a larger build. Do NOT use for real customer, employee, confidential, or production data.
metadata:
  version: "2026.09.16.1"
---

# Demo Builder Generate Data Skill

## Version and Bundled Data

- **Current version:** `2026.09.16.1`
- **Public repository:** `https://github.com/rob-foulkrod/mtt-demo-creation-tools`
- **Approved company list:** `companies.csv` alongside this skill.
- **Approved person-name list:** `names.csv` alongside this skill.

## Local File Validation

- Resolve this skill's own root using the host-provided skill location, not a hardcoded path.
- Validate and read companion files only from paths relative to this skill root: `companies.csv`
  and `names.csv`. Invoking skills must not inspect this skill's companion directory.
- Before generating named data, validate that `companies.csv` exists, is readable, is not empty, and
  has usable `CompanyName` and `EmailDomain` columns.
- Validate that `names.csv` exists, is readable, is not empty, and has either a usable `FullName`
  column or usable `FirstName` and `LastName` columns.
- Treat missing, empty, unreadable, malformed, or unusable companion files as validation failures
  owned by this skill. Report the exact failed file and condition to the invoking workflow.
- Use the bundled instructions and data from this release. Do not fetch replacement skill files
  or newer lists during a demo run.
- If `companies.csv` is missing, empty, unreadable, malformed, or lacks usable company records, stop
  named data generation. Never substitute invented company names.
- If `names.csv` is missing, empty, unreadable, malformed, or lacks usable person-name records, ask
  the user for an approved-name source or explicitly continue with documented role placeholders.
  Never create realistic invented person names.

## When Not to Use

- **Real data of any kind** — real employees, financials, incidents, medical or legal matters. Never synthesize around real records.
- **Formatting or authoring an existing document** — if the content already exists and only needs writing, editing or design, use `docx`, `xlsx`, `pptx` or `create` directly. This skill is for originating data, not styling it.
- **A deck or document with no invented companies or people in it** — an abstract diagram, a process doc, a slide of concepts. No names, no name compliance, no need for this skill.
- **Building a full instructor-led course from existing source decks** — that is `courseware-create`. **But** if that build needs new sample data with company or person names, load this skill for the data portion and hand the named entities back.
- **Power BI, Dataverse or a live system query** — use the relevant data tool; that is real data.

## Scope trigger

This skill is a **compliance gate**, not a convenience. It applies whenever fictitious names will appear in generated content, regardless of how large or small the data task is relative to the overall request.

Apply it when:

- Building a full demo or courseware package, **or** a single sample file, **or** a handful of illustrative rows.
- The data generation is a sub-task of a bigger deliverable (a training pack, a class demo, a deck, a workshop, a proof of concept).
- Naming any company, customer, client, vendor, partner, employee, contact, author, or approver in synthetic content.
- Producing PowerPoint, CSV, JSON, or Markdown as well as Excel and Word.

**Never invent a company name or a person name from imagination, and never derive one.** Variants of an approved name (adding a suffix, a division, a business line, or a second word) are NOT approved names. `Woodgrove Bank` is approved; `Woodgrove Technologies`, `Woodgrove Capital`, and `Woodgrove Bank Holdings` are not.

If more distinct entities are needed than the approved list contains, reuse approved names across different roles or add a non-name qualifier the approved list already permits — do not manufacture new ones.

## Purpose

Apply CELA-safe fictitious-name and data-safety requirements whenever another skill or workflow
creates synthetic content. This skill does not prescribe the scenario, artifact types, data volume,
content structure, prompts, filenames, or delivery package. The invoking skill owns those decisions.

## Absolute compliance rules

### Approved company names only
Use the local `companies.csv` file in the same folder as this skill as the primary machine-readable source for approved company names and approved company-to-domain mappings.

If a provenance PDF such as `Approved Fictitious Company Names and Domain Names - Feb 2026.pdf` is present in the same folder, treat it as the source of record for that CSV. If it is absent, `companies.csv` is authoritative on its own and no warning is needed.

Use only company names from the `CompanyName` column exactly as written. Do not modify, pluralize, rename, shorten, expand, parody, or create variants.

If the user supplies a company name that is not present in `companies.csv`, do not use it. Use Contoso, Ltd. by default and tell the user the supplied company was not in the approved list.

### Approved person names only
Do not invent person names. Person names must come from an approved-name source only.

Use the local `names.csv` file in the same folder as this skill when it is available. Treat that file as an approved-name source. Prefer the `FullName` column when present; otherwise combine `FirstName` and `LastName` from the same row.

If `names.csv` is not available, empty, or unusable, ask the user to obtain and provide an export
from the [CELA Fictitious Names Finder](https://aka.ms/fnftool) or attach another approved-name
source.

If no approved person-name source is available:

1. Generate the data package using role placeholders only, such as Person_001, Person_002, Store Manager 01, Analyst 01, or Employee 001.
2. Include a clearly marked replacement table named `Name Replacement Required`.
3. Tell the user that the placeholders must be replaced with names generated from the [CELA
  Fictitious Names Finder](https://aka.ms/fnftool) before the content is used in packaging,
  documentation, advertising, promotional materials, recordings, or customer-facing demos.
4. Do not create realistic first-name/last-name combinations yourself.

### Handoff contract
Return approved names and domains to the invoking workflow only after validation succeeds:

1. Approved company names come from `companies.csv` `CompanyName` values exactly as written.
2. Approved company email domains come from matching `EmailDomain` values.
3. Approved person names come from `names.csv` `FullName` values, or from same-row `FirstName` plus
   `LastName` when `FullName` is absent.
4. If continuing without usable `names.csv`, return only role placeholders plus a `Name Replacement
   Required` table. Clearly mark that no approved person names were available.
5. Include a short validation summary for the invoking workflow: files checked, record counts,
   selected values returned, and whether placeholders were used.

### Email and domain safety
When creating email addresses:

- `SourceDomainText` may include formatting carried over from the approved source, such as `http://`. Use `EmailDomain` as the normalized email-safe domain value.
- Use the `EmailDomain` value from `companies.csv` for the selected approved company when available.
- For an email address using an approved fictitious domain, use only the person's first name as the username, such as `john@contoso.com`.
- If person names are placeholders, use placeholder-safe emails such as person001@example.com or employee001@example.com.
- Do not create emails that could accidentally route to real people unless they use approved fictitious domains or example.com.
- Keep email addresses unique across the package.

### Logos and design elements
Avoid unique logos or design elements in fictitious content, including assets created by generative AI tools. When a visual identifier is needed, prefer a stylized logotype of the approved fictitious company name or a non-descript, functional symbol.

If a unique logo or design element is necessary:

- Ensure the artwork was created by a Microsoft employee or a vendor operating under a work-for-hire agreement.
- Do not use or resemble an existing third-party trademark or logo.
- Do not use clip art.

### Addresses, phone numbers, and school names

- For street addresses, use sequential numbers, common street names, and incorrect ZIP codes, such as `4567 Main St, Buffalo, NY 98052`.
- For United States telephone numbers, use `555-0100` through `555-0199` with any North American area code except `800`, `866`, `877`, `888`, or `900`. For international numbers, use sequential numbers.
- For school names, use a theme such as trees. Do not use a known real school name or include a person's name.

### No real sensitive data
Never use real customer data, real employee data, real confidential project names, real financials, real incidents, real performance data, real medical records, or real legal matters. The dataset must be synthetic and labeled as such.

### No employee performance evaluation
Do not generate content that ranks, scores, evaluates, or compares named individuals’ workplace performance. You may generate role-based workload, staffing, or training-capacity data, but avoid personal performance judgments.

## Guardrails

- **Never invent a company or person name.** Both come from `companies.csv` and `names.csv` in this skill folder, used verbatim. If a needed name is not on the list, it is not available — substitute an approved one and say so.
- **Never derive a variant.** No suffixes, divisions, business lines, pluralization, abbreviation or added words. An approved name plus anything is a new, unapproved name.
- **Never silently exceed the list.** If the scenario needs more distinct entities than the approved lists provide, stop and tell the user the ceiling (38 companies, 100 people) before generating, then reuse approved names across roles or reduce the entity count.
- **When no approved person-name source is available**, emit role placeholders (`Person_001`, `Analyst 01`) plus a `Name Replacement Required` table — never realistic-looking invented names, not even as a temporary fill.
- **Declare the substitution.** When a user-supplied company or person name is rejected, name the replacement used and why, in the response and in the package README. Do not swap silently.
- **Verify before delivering.** Cross-check every generated name against the two CSVs and report the count checked. A name that reaches a customer-facing artifact unapproved is a legal exposure, not a cosmetic defect.
- **State the data is synthetic** in the package README or a Start Here tab.
- **Use safe fictitious visual and location data.** Do not use third-party logos or marks, real-looking street addresses, unsafe phone numbers, or known school names.

## Validation checklist

Before finalizing output, verify:

- The selected company name exactly matches a `CompanyName` value in `companies.csv`.
- The selected company name and any company email domain match `companies.csv`.
- Every approved person name used can be traced to `names.csv` or another explicitly supplied approved-name source.
- No non-approved company names appear.
- No invented realistic person names appear.
- Any person placeholders are clearly marked for replacement from the CELA Fictitious Names Finder.
- Email domains are approved or example.com.
- Email usernames are unique within the package.
- Logos and design elements follow the fictitious-content guidance.
- Addresses, phone numbers, and school names follow the fictitious-content guidance.
- No generated content evaluates real people or contains real confidential information.
