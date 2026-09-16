# Personal installation

Trainers can use either Cowork or Scout. Choose the product you prefer and install its matching
release ZIP; you do not need both products.

This archive contains demo-on-demand, generate-data, and demo-builder-style-guidelines. Install all
three from the same release. Keep companies.csv and names.csv beside generate-data/SKILL.md and
preserve all companion directories. Do not mix files from main into a released installation.

## Cowork

The Cowork ZIP has manifest.json and PNG icons at its root, with skill folders under skills/.
Install this package through Cowork's plugin interface, not through a chat download prompt.

1. Download [cowork-plugin.zip](https://github.com/rob-foulkrod/mtt-demo-creation-tools/releases/latest/download/cowork-plugin.zip)
  in your browser. Keep the ZIP intact; do not upload the Scout ZIP or GitHub's source-code archive.
2. Open **Cowork > Customize > Plugins > Add plugin**.
3. In **Add a plugin**, select **choose a file** and select the downloaded cowork-plugin.zip,
  or drag and drop the ZIP into the dialog. Follow the on-screen installation and consent steps.
4. Confirm the plugin appears in the installed plugins list.
5. Start a new Cowork conversation and use this verification prompt:

```text
Verify my installed demo tools without downloading, installing, deleting, or replacing anything.
Check discovery of demo-on-demand, generate-data, and demo-builder-style-guidelines.
Read companies.csv and names.csv through the installed generate-data skill, and open the installed
demo builder's PRESENTER-GUIDE.md, QUALITY-STANDARDS.md, and TECHNOLOGY-GUIDANCE.md references.
Check that the shared style guidance is readable. Report the skill versions and host-provided
locations where available. Mark anything you cannot inspect as unverified; do not invent paths
or infer plugin registration from files attached to this conversation.
```

Cowork's chat workspace may be unable to download release files even when your browser can.
Attaching or extracting a ZIP in chat is not proof of persistent plugin installation.
Tenant policy must permit installation. See the advanced guidance below for personal sideloading
and policy requirements.

### Advanced personal installation

Microsoft documents personal sideloading with Agents Toolkit at:
https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/cowork-plugin-development

With Node.js/npm and Microsoft 365 Agents Toolkit CLI installed:

```text
atk auth login
atk install --file-path ./cowork-plugin.zip --scope Personal
```

Complete authentication directly in the host or browser. Never paste credentials into a chat.
Tenant policy must allow personal sideloading. Retain the returned AppId and TitleId for later
updates or removal. If policy blocks installation, contact your administrator; the CLI does not
bypass policy. These instructions do not deploy to the whole tenant or publish to a store.

## Scout

The Scout ZIP contains three skill folders at its root. Ask Scout to install those folders and all
support files into its configured personal skills location. Do not create a Cowork app registration
for this package. If multiple-skill ZIP installation is unsupported, extract and install each folder
through the supported skill installation mechanism.

## Verification and upgrades

- Report each installed skill's name, metadata version, and actual host-provided location.
- Read both approved CSVs through the installed generate-data skill and verify usable records.
- For Cowork, open all three presenter, quality, and technology references.
- Verify discovery in a new conversation; if the installer cannot do this, report it as unverified.
- Before replacing any existing skill, preview the changes and request confirmation. Do not delete
  unrelated skills or overwrite local edits silently. Avoid duplicate old and new registrations.
- For Cowork, keep existing skills until the replacement ZIP is available and validated. If the
  host requires removal before installation, stop and confirm a backup and recovery plan first.
- Keep all shared dependencies from one release. Retain the Cowork app ID across plugin upgrades.

Automated package validation does not prove host installation support. The user must test actual
installation, persistence, activation, and demo behavior in Cowork and Scout.