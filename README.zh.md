# dsh-change-budget

[English](README.md)

dsh-change-budget 为每个 DeepSeek Harness Agent 回合限制结构化文件修改规模。插件在工具主体执行前统计 write、edit，以及 str_replace_editor 的 create、str_replace 和 insert 命令。

## 安装

把本地 checkout 安装到已部署的 Web profile：

```powershell
$env:DSH_HOME='D:\Deepseek harness\.dsh'
dsh plugin --profile web add 'D:\Deepseek harness\plugins\dsh-change-budget'
```

安装打包后的 tarball：

```powershell
dsh plugin --profile web add .\dsh-change-budget-0.1.0.tgz
```

卸载：

```powershell
dsh plugin --profile web remove dsh-change-budget
```

## 配置

| 字段 | 默认值 | 含义 |
| --- | ---: | --- |
| maxFilesPerTurn | 12 | 单个 Agent 回合最多触及的不同规范化路径数 |
| maxMutationsPerTurn | 24 | 单个 Agent 回合最多放行的结构化修改调用数 |
| maxPayloadBytesPerTurn | 262144 | 单个 Agent 回合最多提交的新文本 UTF-8 字节数 |

在 profile 的 cordis.patch.yml 中覆盖插件的完整 config：

```yaml
- id: change-budget
  config:
    maxFilesPerTurn: 20
    maxMutationsPerTurn: 40
    maxPayloadBytesPerTurn: 524288
```

所有字段都必须是正整数。非法配置会导致插件加载失败。

## 行为

插件为每个 Agent 保存独立计数器。新的 turn/start 会重置该 Agent 的额度。并行调用会同步预留额度，因此不能同时穿透上限。工具主体失败会释放预留；工具主体成功后，即使后续展示策略阻止返回结果，该修改仍会消耗额度。

同一规范化路径的重复编辑会继续消耗修改次数和字节额度，但只计为一个不同文件。Windows 路径键不区分大小写。相对路径以 Session 工作目录为基准。

## 模型体验

第一个将要超过上限的调用会在工具主体执行前被拒绝：

```text
Change budget exceeded for this turn: files would reach 13/12. Blocked path: "src/generated/client.ts". Raise the plugin limit or continue in a new user turn.
```

## 限制

- Bash、PowerShell、Shell 和其他命令工具可能在没有结构化路径参数的情况下修改文件；这些修改不计数。
- 符号链接、junction 和其他别名不会合并为同一个物理文件。
- 计数器只保存在内存中，插件重载或 Harness 重启后不会保留。
- 插件不提供仪表盘、数据库或自动提高额度功能。

## 开发

```powershell
pnpm install
pnpm test
pnpm typecheck
pnpm build
```
