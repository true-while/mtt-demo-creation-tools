# Scout skill prompt

Historical authoring example, not a release build input. Tagged packages use the maintained Scout
runtime and shared dependencies. See the [release strategy](../docs/deployment.md).

```text
Create a Scout skill named demo-builder.

Generate a complete SKILL.md.

Requirements:
- Create public-safe Demo on Demand packages.
- Ask first: "Will you be uploading this to GitHub?"
- Support GitHub and non-GitHub delivery scenarios.
- Support Copilot, Scout, Cowork, Agent Builder, SharePoint Agent, and Copilot Studio demos.

Scout packaging distinction:
- Scout does not require a Microsoft 365 Cowork plugin manifest to install a skill.
- The Scout-installable unit is the skill folder itself:
  <skill-name>/SKILL.md
  <skill-name>/references/ optional
  <skill-name>/assets/ optional
  <skill-name>/scripts/ optional
- If a downloaded package is Cowork-shaped, with manifest.json, color.png, outline.png, and
  skills/<skill-name>-plugin/SKILL.md, Scout should install the skill folder from under skills/
  into the user's Scout skills folder.
- Cowork-specific manifest.json, color.png, and outline.png are package metadata for Cowork and
  should not be required for Scout runtime unless the generated Scout skill explicitly uses them.
- Include clear user-facing install guidance for: "install everything from this downloaded Scout
  skill package" by copying the skill folder and any references, assets, scripts, or support files
  into the Scout skills directory.

Do NOT include:
- update skill workflows
- self-update capabilities
- version checks
- version comparisons
- dependency validation
- installation instructions for other skills
- GitHub synchronization logic
- automatic downloads
- update notifications

Keep the skill completely self-contained.

This plugin must contain only functional demo-generation logic.
Exclude all lifecycle-management features including updates,
version checks, dependency management, installation,
migration, or synchronization capabilities.

Include:
- YAML front matter
- description triggers
- workflow steps
- decision tree
- output templates
- validation rules
- examples

Output the final SKILL.md only.
```
