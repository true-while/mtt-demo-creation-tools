# demo-builder-creator-maintenance 1.4.0-log

## Skill name

demo-builder-creator-maintenance

## Skill version

1.4.0

## Additions

- Renamed the Scout maintenance skill and source file from `demo-on-demand-creator-maintenance` to `demo-builder-creator-maintenance`.
- Updated maintenance guidance for the `demo-builder` and `demo-builder-generate-data` paths.
- Documented the `scout-demobuilder-<skill-version>-log.md` runtime changelog convention.
- Required Scout runtime logs to retain `demo-builder` as the skill name and include the Scout environment.
- Updated the minimum data dependency to the first `demo-builder-generate-data` release, `2026.09.16.1`.

## Deletions

- Removed former Scout `demo-on-demand` and `generate-data` identity and path references.
- Removed the ambiguous `demo-builder-<skill-version>-log.md` Scout runtime example.