## Downloads

- **cowork-plugin.zip**: M365 schema 1.28 skills-only plugin for personal sideloading.
- **scout-skills.zip**: three installable skill folders, without Cowork app metadata.
- **SHA256SUMS.txt**: SHA-256 checksums of the ZIPs and release-info.json.
- **release-info.json**: package version, stable Cowork app ID, source commit, schema hash, and individual skill versions.

The Cowork plugin is displayed as **Demo Builder** after installation.

Both packages include demo-builder, demo-builder-generate-data with both approved CSVs, and shared style
guidance. Cowork also includes its presenter, quality, and technology references. Runtime skill
files do not self-update from main. Scout retains its GitHub/non-GitHub branch; Cowork remains
folder-native.

## Installation

Trainers can use either Cowork or Scout. Choose your preferred product and its matching ZIP;
you do not need both.

**Cowork:** download cowork-plugin.zip in your browser and keep it zipped. Open
**Cowork > Customize > Plugins > Add plugin**. In **Add a plugin**, select **choose a file** and select
the downloaded ZIP, or drag and drop it into the dialog. Follow the on-screen installation and consent
steps. Confirm **Demo Builder** appears installed,
then start a new conversation and use the verification prompt in the bundled INSTALL.md. Attaching
the ZIP to chat is not proof of persistent installation.

Consult the advanced personal-installation section of INSTALL.md for personal sideloading with
Microsoft 365 Agents Toolkit and policy requirements. Tenant policy applies to both UI and CLI installation.
Keep existing skills until the replacement package is available and validated. Confirm any required
removal and recovery plan first. Do not deploy to the tenant or submit to the store.

**Scout:** use the website installation prompt, or attach scout-skills.zip and ask Scout to install
every bundled skill and companion file for your personal use. Ask it to report installed skill names,
versions, locations, and availability in a new conversation. Confirm replacement before overwriting
any existing skill, including shared dependencies.

Installation and runtime behavior require user acceptance testing. Automated checks
validate packaging, not host support or installation success. See the repository's deployment guide
for the complete test checklist and update guidance.