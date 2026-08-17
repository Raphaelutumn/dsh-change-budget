# dsh-change-budget 设计规格

## 目标

`dsh-change-budget` 限制一个 DeepSeek Harness Agent 在单轮对话中通过结构化文件工具提交的修改规模。插件在修改执行前拒绝超额调用，降低 Agent 因错误理解、循环调用或并行调度而扩大改动范围的风险。

插件是独立 Cordis bundle，不修改 DeepSeek Harness 核心，不保存会话外状态，也不提供模型工具、后台服务或 Web UI。

## 用户行为

插件分别为每个 Agent、每个 `turn` 维护三项额度：

| 配置字段 | 默认值 | 含义 |
| --- | ---: | --- |
| `maxFilesPerTurn` | `12` | 本轮最多触及的不同文件数 |
| `maxMutationsPerTurn` | `24` | 本轮最多执行的结构化修改次数 |
| `maxPayloadBytesPerTurn` | `262144` | 本轮最多提交的 UTF-8 修改文本字节数 |

三个字段均为可配置的正整数。Schemastery 在插件加载时校验配置并填入默认值；非法配置直接导致该插件实例加载失败。

插件跟踪以下调用：

| 工具 | 计入修改的操作 | 路径参数 | 字节参数 |
| --- | --- | --- | --- |
| `write` | 所有调用 | `file_path` | `content` |
| `edit` | 所有调用 | `file_path` | `new_string` |
| `str_replace_editor` | `create` | `path` | `file_text` |
| `str_replace_editor` | `str_replace`、`insert` | `path` | `new_str`，缺省时按零字节计算 |

`read`、`str_replace_editor.view` 和其他工具不消耗额度。删除文本仍消耗一次修改和一个文件名额，即使新文本为零字节。

如果一次调用会超过任一上限，插件拒绝该调用且不预留额度。错误文本包含当前用量、调用后的预计用量、对应上限和被阻止的路径，并要求用户提高配置或在新的用户回合继续。例如：

```text
Change budget exceeded for this turn: files would reach 13/12. Blocked path: "src/generated/client.ts". Raise the plugin limit or continue in a new user turn.
```

新 `turn/start` 建立新的计数器。不同 Agent 的额度相互隔离。插件热重载或卸载会释放全部内存状态。

## 路径与字节计算

相对路径以 Session header 的 `cwd` 为基准进行词法规范化；缺少 `cwd` 时保留规范化后的输入路径。Windows 使用大小写不敏感的比较键，其他平台保留大小写。插件不解析符号链接，因此指向同一文件的不同符号链接路径可能分别占用文件名额。

字节额度使用 UTF-8 编码后的提交文本长度。编辑计算 `new_string` 或 `new_str` 的完整字节数，不计算净增量，也不读取目标文件来估算最终大小。

参数尚未通过原生工具 schema 校验时，分类器只接受预期类型的路径、命令和文本字段。无法分类的参数不预留额度，由原生工具返回参数错误；该调用不能进入文件修改实现。

## 内部结构

插件包含三个源码模块：

- `src/index.ts` 定义配置 schema，注册工具守卫、执行包装器和最终结果观察器。
- `src/classify.ts` 将已知工具参数转换为 `{ path, payloadBytes }`，并生成平台相关的路径比较键。
- `src/budget.ts` 管理每个 Agent 的回合状态、并发预留、成功提交和拒绝诊断。

状态存放在以 Agent 为键的 `WeakMap` 中。每个回合状态包含已提交的不同路径集合、修改次数、文本字节数，以及以 `ToolExecutionToken` 为键的执行中预留。

## 执行顺序与并发

`ctx.tools.guard()` 在工具执行前同步分类调用并检查 `已提交 + 执行中预留 + 当前调用`。未超限的调用立即建立预留，因此同一 JavaScript 事件循环中进入的并行调用不能同时越过上限。超限时守卫返回单调拒绝原因，后续插件不能重新放行。

插件的 `tools/execute` 包装器观察实际分发结果。成功结果把预留转为已提交用量；失败结果释放预留。工具主体成功后，即使后续 `tools/post-execute` 把展示结果阻止为错误，修改仍计入额度，因为文件操作已经发生。

`tools/result` 处理未进入工具主体的终止路径，例如其他守卫拒绝或执行前取消。它释放仍未结算的预留，不重复处理已经由 `tools/execute` 结算的调用。

## 错误处理

- 缺少 Agent 的宿主内部调用不计数。
- 不支持的工具和只读命令直接放行。
- 参数类型不符合已知工具字段时不预留，由原生工具校验失败。
- 被其他策略拒绝或执行前取消的调用释放预留。
- 工具主体失败时释放预留；成功后发生的展示或策略阻止不释放已经提交的用量。
- 插件没有持久化文件；重启、卸载和 HMR 不需要迁移或清理数据。

## 交付与安装

独立仓库位于 `D:\Deepseek harness\plugins\dsh-change-budget`，包名为 `dsh-change-budget`，初始版本为 `0.1.0`，许可证为 MIT。包包含 TypeScript 源码、编译后的 `lib`、测试、双语 README、`cordis.patch.yml` 和声明 `dsh.bundle` 的 `package.json`。

本机通过以下命令把本地 checkout 链接到现有 `web` profile：

```powershell
pnpm dsh plugin --profile web add ./plugins/dsh-change-budget
```

安装只更新该 profile 的依赖、bundle 列表和 lockfile，不修改 Harness 核心包。发布准备包含可安装 tarball；创建 GitHub 仓库或推送远端不在本次授权范围内。

## 验证

单元测试覆盖工具分类、所有修改子命令、只读调用、中文与 emoji 的 UTF-8 字节数、重复路径、Windows 大小写比较、临界值和超限诊断。

状态测试覆盖失败释放、成功提交、执行前拒绝释放、新回合重置、不同 Agent 隔离、同一路径重复修改和并发预留不能穿透上限。

集成测试使用真实 Cordis 工具管线和测试工具，不需要模型 API Key。安装后运行 `--dump-config` 验证 bundle 层和插件行，再使用独立端口启动 Web profile，确认插件成功加载且日志无错误。

## 首版限制

- 不解析 Bash、PowerShell 或其他命令工具产生的隐式文件修改。
- 不把符号链接、junction 或其他文件别名合并为同一文件。
- 不提供按目录、文件类型或工具分别设置的额度。
- 不提供侧边栏、统计面板、数据库或跨回合累计。
- 不自动提高额度；用户通过配置或新的用户回合继续工作。
