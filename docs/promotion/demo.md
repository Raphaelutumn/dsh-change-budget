# dsh-change-budget demo

This demo proves the timing that matters: the third structured file mutation is rejected before the tool body runs.

## Run it

From the repository root:

```powershell
corepack pnpm demo
```

The command builds `lib/`, starts a minimal Cordis tool runtime, loads `dsh-change-budget`, and invokes the same `write` tool three times in one Agent turn. The demo limit is two distinct files.

Expected output:

```text
dsh-change-budget demo
limit: maxFilesPerTurn=2
write demo/first.txt  -> ALLOWED (tool body ran)
write demo/second.txt -> ALLOWED (tool body ran)
write demo/third.txt  -> BLOCKED before tool body
reason: Change budget exceeded for this turn: files would reach 3/2. Blocked path: "<cwd>\\demo\\third.txt". Raise the plugin limit or continue in a new user turn.
tool body calls: 2
result: PASS
```

The script fails if the first two calls are not allowed, the third call is not rejected, the rejection does not identify the blocked path, or the tool body runs more than twice. It does not write real files; its purpose is to prove the guard timing and the user-visible rejection message without changing a workspace.

![Terminal demo showing the third file blocked before the tool body](../../assets/dsh-change-budget-demo.svg)

## What this proves

- `maxFilesPerTurn` is enforced per Agent turn.
- The third distinct path is rejected before the registered `write` body executes.
- The rejection names the violated dimension and blocked path.

## What it does not prove

This is a focused runtime proof, not a full compatibility test for every DSH profile or every supported mutation tool. Run the complete project verification before publishing a change:

```powershell
corepack pnpm run verify
```

The plugin deliberately does not count arbitrary Shell, PowerShell, or Bash filesystem writes.

## 中文说明

这个演示证明的是关键时序：第三个结构化文件修改会在工具主体运行前被拒绝。

在仓库根目录运行 `corepack pnpm demo`。脚本会构建 `lib/`，启动最小 Cordis 工具运行时，加载插件，并在同一个 Agent 回合中调用三次 `write`；前两次成功，第三次被拦截。脚本还会断言工具主体只执行了两次，因此输出不是手写的假结果。
