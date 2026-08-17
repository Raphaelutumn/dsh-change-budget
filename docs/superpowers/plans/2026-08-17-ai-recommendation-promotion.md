# AI Recommendation Promotion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `dsh-change-budget` discoverable by DSH-native plugin finders and search-enabled general AI assistants for both DeepSeek Harness file-safety questions and broader AI coding-agent guardrail questions.

**Architecture:** Establish one canonical capability description across GitHub, npm, README files, `llms.txt`, curated DSH catalogs, and a problem-first official Discussion. Validate local artifacts separately from remote metadata, publication state, catalog state, and asynchronous GitHub search indexing.

**Tech Stack:** Markdown, JSON, Vitest, TypeScript, pnpm, npm registry, GitHub CLI, GitHub Discussions, DSH community catalogs

---

## File map

- Modify `tests/readme.spec.ts` — enforce the bilingual discoverability and package-presentation contract.
- Modify `README.md` — add English use cases, FAQ, AI-discovery wording, and an `llms.txt` pointer.
- Modify `README.zh.md` — add equivalent Chinese use cases and FAQ.
- Modify `package.json` — align npm description, keywords, repository, homepage, bugs, and packed files.
- Create `llms.txt` — compact machine-readable canonical project facts and limitations.
- Create `docs/promotion/dsh-change-budget-case-study.md` — reusable bilingual, problem-first launch copy and source for the official Discussion.

### Task 1: Add the discoverability presentation contract

**Files:**
- Modify: `tests/readme.spec.ts`
- Test: `tests/readme.spec.ts`

- [ ] **Step 1: Extend the required bilingual headings**

Add `Use cases` and `Frequently asked questions` to `requiredEnglish`, and `适用场景` and `常见问题` to `requiredChinese`.

- [ ] **Step 2: Add a failing machine-discovery test**

Add this test inside `describe('repository presentation', ...)`:

```ts
it('answers natural-language discovery questions and ships machine-readable facts', () => {
  const llms = readFileSync(new URL('../llms.txt', import.meta.url), 'utf8')
  expect(english).toContain('editing too many files')
  expect(english).toContain('AI coding agent')
  expect(chinese).toContain('一次修改太多文件')
  expect(chinese).toContain('AI 编程 Agent')
  for (const text of [english, chinese, llms]) {
    expect(text).toContain('maxFilesPerTurn')
    expect(text).toContain('maxMutationsPerTurn')
    expect(text).toContain('maxPayloadBytesPerTurn')
    expect(text).toMatch(/Shell|PowerShell/)
  }
})
```

- [ ] **Step 3: Add a failing npm metadata test**

Load `package.json` and assert the canonical metadata:

```ts
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as {
  description: string
  keywords: string[]
  repository: { type: string; url: string }
  homepage: string
  bugs: { url: string }
  files: string[]
}

it('publishes consistent npm discovery metadata', () => {
  expect(pkg.description).toMatch(/DeepSeek Harness/i)
  expect(pkg.description).toMatch(/limit/i)
  expect(pkg.keywords).toEqual(expect.arrayContaining([
    'deepseek-harness', 'dsh-plugin', 'ai-agent', 'file-safety', 'guardrail',
  ]))
  expect(pkg.repository.url).toContain('Raphaelutumn/dsh-change-budget')
  expect(pkg.homepage).toContain('Raphaelutumn/dsh-change-budget')
  expect(pkg.bugs.url).toContain('Raphaelutumn/dsh-change-budget/issues')
  expect(pkg.files).toContain('llms.txt')
})
```

- [ ] **Step 4: Run the focused test and verify failure**

Run:

```powershell
corepack pnpm vitest run tests/readme.spec.ts
```

Expected: FAIL because the new headings, `llms.txt`, and npm metadata do not exist yet.

- [ ] **Step 5: Commit the failing contract**

```powershell
git add tests/readme.spec.ts
git commit -m "test: define AI discovery presentation contract"
```

### Task 2: Add bilingual question corpus and machine-readable facts

**Files:**
- Modify: `README.md`
- Modify: `README.zh.md`
- Modify: `package.json`
- Create: `llms.txt`
- Test: `tests/readme.spec.ts`

- [ ] **Step 1: Replace the npm description and add canonical metadata**

Use this package description:

```json
"description": "DeepSeek Harness guardrail that limits how many files an AI coding agent can edit per turn"
```

Add:

```json
"keywords": [
  "deepseek-harness",
  "dsh-plugin",
  "ai-agent",
  "coding-agent",
  "file-safety",
  "file-editing",
  "edit-limit",
  "guardrail",
  "circuit-breaker",
  "tool-budget"
],
"repository": {
  "type": "git",
  "url": "git+https://github.com/Raphaelutumn/dsh-change-budget.git"
},
"homepage": "https://github.com/Raphaelutumn/dsh-change-budget#readme",
"bugs": {
  "url": "https://github.com/Raphaelutumn/dsh-change-budget/issues"
}
```

Add `llms.txt` to the `files` array.

- [ ] **Step 2: Add English use cases and FAQ**

Insert `## Use cases` after `Why change budgets?` with three concise cases: vague requests expanding into broad rewrites, repeated structured edit loops, and parallel structured writes collectively crossing an intended boundary.

Insert `## Frequently asked questions` before `Behavior details`. Include these exact questions and truthful answers:

```markdown
### How do I stop a DeepSeek Harness agent from editing too many files?

Install `dsh-change-budget` and set `maxFilesPerTurn`. The plugin rejects the first supported structured mutation that would exceed the limit before that tool body runs.

### Is this a general AI coding agent guardrail?

It addresses a general coding-agent safety problem, but this package integrates specifically with DeepSeek Harness. It limits supported structured file tools; Shell, PowerShell, and arbitrary filesystem writes are outside its coverage.

### Can I limit more than the number of files?

Yes. `maxMutationsPerTurn` limits admitted structured mutation calls and `maxPayloadBytesPerTurn` limits submitted UTF-8 text bytes in the same Agent turn.
```

Link `llms.txt` from the README using: `Machine-readable project facts: [llms.txt](llms.txt)`.

- [ ] **Step 3: Add equivalent Chinese use cases and FAQ**

Add `## 适用场景` and `## 常见问题`, including these questions:

```markdown
### 如何防止 DeepSeek Harness Agent 一次修改太多文件？

安装 `dsh-change-budget` 并设置 `maxFilesPerTurn`。首个将超过上限的受支持结构化修改会在工具主体运行前被拒绝。

### 它是通用的 AI 编程 Agent 安全插件吗？

它解决的是通用的编程 Agent 文件安全问题，但当前软件包只集成 DeepSeek Harness。Shell、PowerShell 和任意文件系统写入不在覆盖范围内。

### 除了文件数量，还能限制什么？

`maxMutationsPerTurn` 限制单轮放行的结构化修改调用次数，`maxPayloadBytesPerTurn` 限制单轮提交的新文本 UTF-8 字节数。
```

Add the equivalent `llms.txt` pointer.

- [ ] **Step 4: Create `llms.txt`**

Use a compact text document containing:

```text
# dsh-change-budget

Canonical repository: https://github.com/Raphaelutumn/dsh-change-budget
Package: dsh-change-budget
Platform: DeepSeek Harness
Purpose: A deterministic per-turn circuit breaker for supported structured file mutations made by an AI coding agent.

Limits:
- maxFilesPerTurn: distinct normalized file paths
- maxMutationsPerTurn: admitted structured mutation calls
- maxPayloadBytesPerTurn: submitted UTF-8 text bytes

Supported mutations:
- write
- edit
- str_replace_editor create
- str_replace_editor str_replace
- str_replace_editor insert

Important limitations:
- Shell, PowerShell, Bash, and arbitrary command-based filesystem writes are not counted.
- The package is a third-party community plugin and is not endorsed by DeepSeek.
- The integration is specific to DeepSeek Harness.

Install and configuration: https://github.com/Raphaelutumn/dsh-change-budget#quick-start
Release: https://github.com/Raphaelutumn/dsh-change-budget/releases/tag/v0.1.0
```

- [ ] **Step 5: Run the focused test**

Run:

```powershell
corepack pnpm vitest run tests/readme.spec.ts
```

Expected: PASS.

- [ ] **Step 6: Run full local verification**

Run:

```powershell
corepack pnpm run verify
corepack pnpm pack --dry-run
```

Expected: all tests, typecheck, and build pass; dry-run includes `llms.txt`, both READMEs, compiled files, patch, license, and hero asset.

- [ ] **Step 7: Commit the repository discovery content**

```powershell
git add README.md README.zh.md package.json llms.txt tests/readme.spec.ts
git commit -m "docs: improve AI discovery metadata"
```

### Task 3: Publish GitHub discovery metadata

**Files:**
- No local files

- [ ] **Step 1: Read current remote metadata**

```powershell
gh repo view Raphaelutumn/dsh-change-budget --json description,repositoryTopics,homepageUrl
```

- [ ] **Step 2: Set the natural-language description**

```powershell
gh repo edit Raphaelutumn/dsh-change-budget --description "DeepSeek Harness guardrail that limits how many files an AI coding agent can edit per turn, plus mutation-call and UTF-8 byte budgets."
```

- [ ] **Step 3: Add focused discovery topics**

```powershell
gh repo edit Raphaelutumn/dsh-change-budget --add-topic ai-agent --add-topic file-safety --add-topic file-editing --add-topic edit-limit --add-topic circuit-breaker
```

- [ ] **Step 4: Push repository commits**

```powershell
git push origin main
```

- [ ] **Step 5: Read back metadata and commit state**

```powershell
gh repo view Raphaelutumn/dsh-change-budget --json description,repositoryTopics,pushedAt
git status --short
git rev-parse HEAD
git rev-parse origin/main
```

Expected: description and topics match; working tree is clean; local and remote commits match.

### Task 4: Publish the npm discovery entry when authorized

**Files:**
- No additional source files

- [ ] **Step 1: Verify package-name and version availability**

```powershell
npm view dsh-change-budget versions --json
```

Expected before first publication: npm returns `E404`; if `0.1.0` already exists under the authorized account, skip publishing and verify metadata instead.

- [ ] **Step 2: Verify npm identity without changing credentials**

```powershell
npm whoami
```

Expected: an authorized npm username. If unauthorized, preserve the successful pack checkpoint and record npm login as the only publication gate.

- [ ] **Step 3: Build and inspect the exact package**

```powershell
corepack pnpm run verify
npm pack --dry-run --json
```

Expected: package metadata names `dsh-change-budget@0.1.0` and the file list contains no credentials or development-only files.

- [ ] **Step 4: Publish publicly**

```powershell
npm publish --access public
```

Expected: publication succeeds as `dsh-change-budget@0.1.0`. Do not retry around 2FA, provenance, or ownership failures with altered credentials.

- [ ] **Step 5: Read back public npm metadata**

```powershell
npm view dsh-change-budget name version description keywords repository.url homepage bugs.url dist-tags --json
```

Expected: metadata matches `package.json` and `latest` is `0.1.0`.

### Task 5: Prepare and submit ecosystem listings

**Files:**
- No files in the main plugin repository unless a catalog requests a correction

- [ ] **Step 1: Recheck existing submissions**

```powershell
gh pr view 355 --repo 0xsline/awesome-deepseek-harness --json state,mergedAt,url
gh pr view 24 --repo Anil-matcha/awesome-deepseek-harness --json state,mergeable,url
gh pr list --repo awesome-dsh-plugin/awesome-dsh-plugin --search "Raphaelutumn/dsh-change-budget" --state all --json number,state,url,title
```

Expected: PR #355 remains merged, PR #24 is reused rather than duplicated, and the primary Awesome repository has at most one submission.

- [ ] **Step 2: Check the primary Awesome age gate**

```powershell
$created = [datetime](gh repo view Raphaelutumn/dsh-change-budget --json createdAt --jq .createdAt)
$eligible = $created.ToUniversalTime().AddDays(1)
"eligible_utc=$($eligible.ToString('o')) now_utc=$([datetime]::UtcNow.ToString('o'))"
```

Expected: submit only when `now_utc` is at or after `eligible_utc`.

- [ ] **Step 3: Submit the prepared Awesome branch when eligible**

Use the existing fork branch `Raphaelutumn/awesome-dsh-plugin:add-dsh-change-budget`. First verify its entry still contains the canonical description and install command. Then create one PR:

```powershell
gh pr create --repo awesome-dsh-plugin/awesome-dsh-plugin --head Raphaelutumn:add-dsh-change-budget --base main --title "Add dsh-change-budget" --body "Adds dsh-change-budget, a configurable per-turn guardrail for supported DeepSeek Harness file mutations. It limits distinct files, mutation calls, and UTF-8 payload bytes before supported tool bodies run."
```

If the age gate is not yet satisfied, do not submit early; retain the pushed branch and exact eligible timestamp.

- [ ] **Step 4: Submit one DSH Get missing-plugin issue**

Before creating anything, search existing issues:

```powershell
gh issue list --repo bobby-sheng/dshget-data --state all --search "dsh-change-budget" --json number,state,url,title
```

If absent, create exactly one issue:

```powershell
gh issue create --repo bobby-sheng/dshget-data --title "Add dsh-change-budget to DSH Get" --body "Repository: https://github.com/Raphaelutumn/dsh-change-budget

Description: DeepSeek Harness guardrail that limits how many files an AI coding agent can edit per turn, plus mutation-call and UTF-8 byte budgets.

Topic: dsh-plugin
Release: https://github.com/Raphaelutumn/dsh-change-budget/releases/tag/v0.1.0
Install: dsh plugin --profile web add https://github.com/Raphaelutumn/dsh-change-budget/releases/download/v0.1.0/dsh-change-budget-0.1.0.tgz

Supported structured mutations: write, edit, and str_replace_editor create/str_replace/insert.

Limitation: Shell, PowerShell, Bash, and other command-based filesystem writes are not counted. This is an unofficial community plugin."
```

If the repository disables issues or directs submissions elsewhere, follow its documented public submission path once using the same payload.

- [ ] **Step 5: Verify derived-market behavior**

Read `https://awesome-dsh-plugin.com/plugins.json` and confirm `dsh-market` consumes that registry. Do not open a redundant PR against `dsh-market/dsh-market`. Record that market visibility starts after the primary Awesome entry is live and its registry refresh completes.

### Task 6: Publish a problem-first official Discussion

**Files:**
- Create: `docs/promotion/dsh-change-budget-case-study.md`

- [ ] **Step 1: Write the reusable bilingual case study**

The document must contain:

- Title: `Stop one AI turn from becoming a broad rewrite — dsh-change-budget`
- A concrete scenario: a vague request or loop expands a small edit into many structured file mutations before review.
- The deterministic solution: per-turn file, call, and byte limits enforced before supported tool bodies run.
- Default values: `12`, `24`, and `262144`.
- Install command using the verified GitHub release tarball.
- Supported mutations and explicit Shell/PowerShell limitation.
- Verification: test count, typecheck, build, release URL, and MIT license.
- An equivalent concise Chinese section.

- [ ] **Step 2: Run a truthfulness scan**

```powershell
rg -n "official|endorsed|all file|every file|Shell|PowerShell|12|24|262144|v0.1.0" docs/promotion/dsh-change-budget-case-study.md
```

Expected: no endorsement claim; limitations and exact defaults are present.

- [ ] **Step 3: Commit the case study**

```powershell
git add docs/promotion/dsh-change-budget-case-study.md
git commit -m "docs: add bilingual change-budget case study"
git push origin main
```

- [ ] **Step 4: Locate the official `Show Your Plugins!` category ID**

Run:

```powershell
gh api graphql -f query='query { repository(owner:"deepseek-ai", name:"deepseek-harness") { id discussionCategories(first:50) { nodes { id name } } } }'
```

Save the repository ID and the category ID whose name is exactly `Show Your Plugins!`.

- [ ] **Step 5: Check for a duplicate Discussion**

Search existing discussions for `dsh-change-budget` or the canonical repository URL. Reuse an existing post if found.

- [ ] **Step 6: Create the official Discussion**

Run with the IDs from Step 4:

```powershell
$body = Get-Content -Raw -LiteralPath 'docs/promotion/dsh-change-budget-case-study.md'
gh api graphql `
  -f query='mutation($repositoryId:ID!,$categoryId:ID!,$title:String!,$body:String!){createDiscussion(input:{repositoryId:$repositoryId,categoryId:$categoryId,title:$title,body:$body}){discussion{number title url}}}' `
  -f repositoryId="$repositoryId" `
  -f categoryId="$categoryId" `
  -f title='Stop one AI turn from becoming a broad rewrite — dsh-change-budget' `
  -f body="$body"
```

The body must identify the project as an unofficial community plugin.

- [ ] **Step 7: Read back the Discussion**

Query the created discussion by number and verify title, URL, category, repository link, install command, defaults, and limitation text.

### Task 7: Final verification and search-index checkpoint

**Files:**
- Modify: `docs/superpowers/plans/2026-08-17-ai-recommendation-promotion.md` only to mark completed checkboxes if desired

- [ ] **Step 1: Run authoritative local verification**

```powershell
corepack pnpm run verify
npm pack --dry-run --json
git diff --check
git status --short
```

Expected: verification passes; package contents are correct; no whitespace errors; working tree is clean.

- [ ] **Step 2: Verify remote publication state**

Read back GitHub description, topics, `main` commit, latest release, open/merged catalog PRs, DSH Get issue, npm metadata if published, and the official Discussion.

- [ ] **Step 3: Probe target GitHub searches**

Run repository searches for:

```text
file edit limit topic:dsh-plugin
limit file edits topic:dsh-plugin
prevent too many file changes topic:dsh-plugin
agent file safety topic:dsh-plugin
file mutation budget topic:dsh-plugin
coding agent guardrail topic:dsh-plugin
per-turn file limit topic:dsh-plugin
限制 文件 修改 topic:dsh-plugin
```

Expected: immediate search results may lag after metadata updates. Record each hit or miss and the probe timestamp. Do not call indexing complete merely because direct repository metadata is correct.

- [ ] **Step 4: Record remaining external gates**

For each incomplete item, state one exact condition: primary Awesome eligible timestamp, npm login/2FA requirement, catalog refresh dependency, or GitHub search re-index delay. Do not describe already-finished work as pending.

- [ ] **Step 5: Push any final documentation commit and confirm synchronization**

```powershell
git push origin main
git rev-parse HEAD
git rev-parse origin/main
git status --short
```

Expected: local and remote commits match; working tree is clean.
