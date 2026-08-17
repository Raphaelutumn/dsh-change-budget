# dsh-change-budget

[中文](README.zh.md)

dsh-change-budget limits structured file mutations for each DeepSeek Harness Agent turn. It tracks write, edit, and the create, str_replace, and insert commands of str_replace_editor before they reach the tool body.

## Install

Install a local checkout into the deployed Web profile:

```powershell
$env:DSH_HOME='D:\Deepseek harness\.dsh'
dsh plugin --profile web add 'D:\Deepseek harness\plugins\dsh-change-budget'
```

Install a packaged tarball:

```powershell
dsh plugin --profile web add .\dsh-change-budget-0.1.0.tgz
```

Remove it:

```powershell
dsh plugin --profile web remove dsh-change-budget
```

## Configuration

| Field | Default | Meaning |
| --- | ---: | --- |
| maxFilesPerTurn | 12 | Maximum distinct normalized paths in one Agent turn |
| maxMutationsPerTurn | 24 | Maximum admitted structured mutation calls in one Agent turn |
| maxPayloadBytesPerTurn | 262144 | Maximum UTF-8 bytes submitted as new text in one Agent turn |

Override the complete plugin config in the profile cordis.patch.yml:

```yaml
- id: change-budget
  config:
    maxFilesPerTurn: 20
    maxMutationsPerTurn: 40
    maxPayloadBytesPerTurn: 524288
```

Every field must be a positive integer. Invalid configuration fails plugin loading.

## Behavior

The plugin keeps independent counters for each Agent. A new turn/start resets that Agent's counters. Pending parallel calls reserve capacity synchronously, so concurrent calls cannot cross a limit together. A failed tool body releases its reservation; a successful body consumes the reservation even when a later presentation policy blocks the returned result.

Repeated edits of the same normalized path consume additional mutation and byte capacity but count as one distinct file. Windows path keys are case-insensitive. Relative paths use the Session working directory.

## Model experience

The first call that would cross a limit is rejected before the tool body runs:

```text
Change budget exceeded for this turn: files would reach 13/12. Blocked path: "src/generated/client.ts". Raise the plugin limit or continue in a new user turn.
```

## Limitations

- Bash, PowerShell, Shell, and other command tools can mutate files without structured path arguments; those mutations are not counted.
- Symlinks, junctions, and other aliases are not resolved to one physical file.
- Counters are in memory and do not persist across plugin reloads or Harness restarts.
- The package has no dashboard, database, or automatic limit increase.

## Development

```powershell
pnpm install
pnpm test
pnpm typecheck
pnpm build
```
