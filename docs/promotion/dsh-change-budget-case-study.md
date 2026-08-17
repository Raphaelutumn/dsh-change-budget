# Stop one AI turn from becoming a broad rewrite — dsh-change-budget

> Unofficial community plugin for DeepSeek Harness. Not affiliated with or endorsed by DeepSeek.

A small coding request can become a broad rewrite before a human notices. A vague instruction, an unexpected loop, or several parallel tool calls may cause an Agent to keep submitting structured edits across more files than the user intended.

[`dsh-change-budget`](https://github.com/Raphaelutumn/dsh-change-budget) adds a deterministic circuit breaker to that boundary. For every DeepSeek Harness Agent turn, it reserves and enforces three configurable limits before supported tool bodies run:

| Limit | Default | What it caps |
| --- | ---: | --- |
| `maxFilesPerTurn` | `12` | Distinct normalized file paths |
| `maxMutationsPerTurn` | `24` | Admitted structured mutation calls |
| `maxPayloadBytesPerTurn` | `262144` | Submitted new-text UTF-8 bytes |

The first supported call that would cross a limit is rejected before its tool body executes. Pending parallel calls reserve capacity synchronously, so concurrent writes cannot cross the configured boundary together. Failed tool bodies release their reservation, and a new `turn/start` opens a fresh budget for that Agent.

## Install

```powershell
Invoke-WebRequest `
  -Uri 'https://github.com/Raphaelutumn/dsh-change-budget/releases/download/v0.1.0/dsh-change-budget-0.1.0.tgz' `
  -OutFile '.\dsh-change-budget-0.1.0.tgz'

dsh plugin --profile web add .\dsh-change-budget-0.1.0.tgz
```

Supported mutations are `write`, `edit`, and the `create`, `str_replace`, and `insert` operations of `str_replace_editor`.

Important limitation: Shell, PowerShell, Bash, and other command-based filesystem writes do not expose the same structured path and text fields, so those writes are not counted. Symlink and junction aliases are also not resolved to a single physical file.

The v0.1.0 release is MIT licensed. The repository currently passes 22 tests, TypeScript typecheck, build, and package-content verification. The published release asset includes a SHA-256 digest.

- Repository: https://github.com/Raphaelutumn/dsh-change-budget
- Release: https://github.com/Raphaelutumn/dsh-change-budget/releases/tag/v0.1.0
- Configuration and limitations: https://github.com/Raphaelutumn/dsh-change-budget#configuration

---

## 中文：防止一个 Agent 回合扩大成大范围重写

> DeepSeek Harness 非官方社区插件，与 DeepSeek 无隶属或背书关系。

一次小型编码需求可能在人工发现前扩大成大范围重写。模糊指令、意外循环或多个并行工具调用，都可能让 Agent 持续向更多文件提交结构化修改。

[`dsh-change-budget`](https://github.com/Raphaelutumn/dsh-change-budget) 在这个边界加入确定性的熔断机制。它为每个 DeepSeek Harness Agent 回合预留并执行三项可配置上限：不同文件数默认 `12`、结构化修改调用数默认 `24`、提交的新文本 UTF-8 字节数默认 `262144`。

首个将超过上限的受支持调用会在工具主体运行前被拒绝。并行调用会同步预留额度，因此不能一起穿透上限；工具主体失败会释放预留，新 `turn/start` 会为该 Agent 开启一组新额度。

安装命令与上方相同。当前覆盖 `write`、`edit`，以及 `str_replace_editor` 的 `create`、`str_replace` 和 `insert`。

重要限制：Shell、PowerShell、Bash 及其他命令工具的文件写入没有同样的结构化路径和文本字段，因此不计入额度；符号链接和 junction 别名也不会合并为同一个物理文件。

v0.1.0 使用 MIT 许可证。仓库当前通过 22 项测试、TypeScript 类型检查、构建和发布包内容检查；已发布的 Release 资产带有 SHA-256 摘要。
