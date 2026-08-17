# Repository Promotion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the dsh-change-budget GitHub repository into a polished, bilingual promotional landing page and publish a verifiable v0.1.0 release.

**Architecture:** Keep promotion assets isolated under `assets/`, preserve the English README as the default GitHub landing page, and mirror its information hierarchy in the Chinese README. Repository metadata and the release are applied through GitHub CLI only after local content and tests pass.

**Tech Stack:** Markdown, Mermaid, GitHub badges, PNG raster artwork, GitHub CLI, pnpm, Vitest, TypeScript

---

## File map

- Create: `assets/dsh-change-budget-hero.png` — README hero artwork without logos or embedded body copy.
- Modify: `README.md` — English promotional landing page.
- Modify: `README.zh.md` — complete Chinese counterpart.
- Create: `tests/readme.spec.ts` — repository presentation contract for asset references, bilingual structure, truthful limitations, and install commands.
- Create: `tests/package.spec.ts` — public-development portability contract.
- Modify: `package.json` — replace machine-local development links with published versions.
- Modify: `pnpm-lock.yaml` — lock the published development dependency graph.
- Modify externally: GitHub repository description, homepage, topics, and release `v0.1.0`.
- Upload externally: `C:\Users\29648\Documents\Codex\2026-08-17\qi\outputs\dsh-change-budget-0.1.0.tgz` as the release asset.

### Task 1: Generate and validate the hero artwork

**Files:**
- Create: `assets/dsh-change-budget-hero.png`

- [ ] **Step 1: Generate the banner with the built-in image tool**

Use this prompt:

```text
Use case: ads-marketing
Asset type: GitHub repository README hero banner for an open-source developer tool
Primary request: a premium abstract visual representing a configurable safety budget that stops an AI coding agent from modifying too many files
Scene/backdrop: deep navy ocean-like technical space with subtle grid depth
Subject: a luminous cyan bounded gauge protecting a neat stack of file cards; a few controlled flow lines pass through the boundary while excess lines stop cleanly at the perimeter
Style/medium: polished 3D technical illustration, restrained developer-tool branding, crisp and modern
Composition/framing: wide 3:1 banner, central visual with safe margins, readable when scaled to GitHub README width
Lighting/mood: calm, trustworthy, precise, softly luminous
Color palette: near-black navy, DeepSeek-like blue, cyan, small violet accents
Materials/textures: glass, brushed dark metal, subtle particles
Constraints: no official DeepSeek logo, no company logo, no text, no letters, no watermark, no people, no code screenshots
Avoid: cyberpunk clutter, red warning screens, padlocks, shields, generic stock-photo appearance
```

Expected: one wide raster asset with no visible text or trademarked logo.

- [ ] **Step 2: Copy the generated image into the repository**

Create `assets/` if absent and copy the selected built-in image result to:

```text
D:\Deepseek harness\plugins\dsh-change-budget\assets\dsh-change-budget-hero.png
```

- [ ] **Step 3: Inspect the saved asset**

Use the local image viewer and confirm:

- the image is landscape and approximately 3:1;
- no text, logo, or watermark appears;
- the central gauge and file-card metaphor remain legible at reduced size;
- the image has no broken or cropped edges.

- [ ] **Step 4: Commit the asset**

```powershell
git add assets/dsh-change-budget-hero.png
git commit -m "docs: add repository hero artwork"
```

### Task 1A: Make the public development setup portable

**Files:**
- Create: `tests/package.spec.ts`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

- [ ] **Step 1: Add a failing package portability test**

The test parses `package.json` and rejects every `devDependencies` value that begins with `file:` or `link:`, or with an absolute Windows drive path.

- [ ] **Step 2: Verify the machine-local dependency failure**

```powershell
corepack pnpm vitest run tests/package.spec.ts
```

Expected: FAIL on `link:D:/Deepseek harness/...`.

- [ ] **Step 3: Replace local links with published development versions**

Use `@deepseek-ai/cordis@4.0.1` and `0.1.0-rc.6` for `@deepseek-ai/dsh-llm`, `@deepseek-ai/dsh-system-prompt`, and `@deepseek-ai/dsh-tools`. Keep the runtime peer range compatible with Harness rc.5.

- [ ] **Step 4: Reinstall and verify public development compatibility**

```powershell
corepack pnpm install
corepack pnpm vitest run tests/package.spec.ts tests/classify.spec.ts tests/budget.spec.ts tests/plugin.spec.ts
corepack pnpm run typecheck
```

Expected: package portability, all 15 runtime tests, and typecheck PASS.

- [ ] **Step 5: Commit the portability fix**

```powershell
git add package.json pnpm-lock.yaml tests/package.spec.ts docs/superpowers/plans/2026-08-17-repository-promotion.md
git commit -m "chore: make public development setup portable"
```

### Task 2: Add a failing README presentation contract

**Files:**
- Create: `tests/readme.spec.ts`

- [ ] **Step 1: Write the presentation tests**

Create `tests/readme.spec.ts` with:

```ts
import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const english = readFileSync(new URL('../README.md', import.meta.url), 'utf8')
const chinese = readFileSync(new URL('../README.zh.md', import.meta.url), 'utf8')

const requiredEnglish = [
  'Why change budgets?',
  'How it works',
  'Quick start',
  'Configuration',
  'Counted mutations',
  'Limitations',
  'Contributing',
]

const requiredChinese = [
  '为什么需要修改额度？',
  '工作原理',
  '快速开始',
  '配置',
  '计入额度的修改',
  '限制',
  '参与贡献',
]

describe('repository presentation', () => {
  it('ships and references the hero asset in both languages', () => {
    expect(existsSync(new URL('../assets/dsh-change-budget-hero.png', import.meta.url))).toBe(true)
    expect(english).toContain('assets/dsh-change-budget-hero.png')
    expect(chinese).toContain('assets/dsh-change-budget-hero.png')
  })

  it('keeps the bilingual information architecture aligned', () => {
    for (const heading of requiredEnglish) expect(english).toContain(heading)
    for (const heading of requiredChinese) expect(chinese).toContain(heading)
  })

  it('keeps install, defaults, supported tools, and limitations explicit', () => {
    for (const readme of [english, chinese]) {
      expect(readme).toContain('dsh-change-budget-0.1.0.tgz')
      expect(readme).toContain('maxFilesPerTurn')
      expect(readme).toContain('maxMutationsPerTurn')
      expect(readme).toContain('maxPayloadBytesPerTurn')
      expect(readme).toContain('str_replace_editor')
      expect(readme).toMatch(/Shell|PowerShell/)
      expect(readme).toMatch(/symlink|Symlink|符号链接/)
    }
  })
})
```

- [ ] **Step 2: Run the focused test and verify failure**

```powershell
corepack pnpm vitest run tests/readme.spec.ts
```

Expected: FAIL because the hero asset or new promotional headings are absent.

### Task 3: Rebuild both README landing pages

**Files:**
- Modify: `README.md`
- Modify: `README.zh.md`

- [ ] **Step 1: Replace the English README hierarchy**

Use this exact top-level order:

```markdown
<p align="center">
  <img src="assets/dsh-change-budget-hero.png" alt="A bounded change budget protecting structured file mutations" width="100%">
</p>

<h1 align="center">dsh-change-budget</h1>
<p align="center"><strong>Stop runaway file edits before they reach the tool body.</strong></p>
<p align="center"><a href="README.zh.md">中文</a></p>
```

Then add centered release, license, TypeScript, DeepSeek Harness, and stars badges. Follow with these sections in order:

1. `## Why change budgets?` — explain the accidental broad-edit problem in two short paragraphs.
2. Three bold proof points — per-Agent/per-turn isolation, atomic reservations for parallel calls, configurable positive-integer limits.
3. `## How it works` — Mermaid flowchart: supported tool call → classify → reserve → allow/reject → commit/release.
4. `## Quick start` — tarball install first, local checkout second, removal third.
5. `## Configuration` — defaults table and YAML override.
6. `## Counted mutations` — table covering write, edit, create, str_replace, and insert with payload fields.
7. `## Model experience` — the exact current rejection message.
8. `## Behavior details` — repeated paths, Windows case folding, relative paths, turn reset, and successful-body accounting.
9. `## Limitations` — Shell/PowerShell, aliases, in-memory counters, and no automatic increases.
10. `## Contributing` — install, test, typecheck, build, and issue/PR invitation.
11. `## License` — MIT.

Do not claim Shell coverage, persistence, symlink resolution, official endorsement, or npm publication.

- [ ] **Step 2: Replace the Chinese README with the same hierarchy**

Use the same banner, badges, tables, Mermaid diagram, examples, and section order with natural Chinese copy. Keep English tool names and configuration keys exact. The title sections must include:

```markdown
## 为什么需要修改额度？
## 工作原理
## 快速开始
## 配置
## 计入额度的修改
## 模型看到的提示
## 行为细节
## 限制
## 参与贡献
## 许可证
```

- [ ] **Step 3: Run the focused presentation test**

```powershell
corepack pnpm vitest run tests/readme.spec.ts
```

Expected: 3 tests PASS.

- [ ] **Step 4: Run Markdown consistency checks**

```powershell
rg -n "maxFilesPerTurn|maxMutationsPerTurn|maxPayloadBytesPerTurn|str_replace_editor|Shell|PowerShell|symlink|符号链接" README.md README.zh.md
git diff --check
```

Expected: all supported fields and limitations appear; diff check exits 0.

- [ ] **Step 5: Commit README and presentation tests**

```powershell
git add README.md README.zh.md tests/readme.spec.ts
git commit -m "docs: turn readme into a promotional landing page"
```

### Task 4: Verify and publish repository metadata

**Files:**
- No repository file changes.

- [ ] **Step 1: Run the complete local verification**

```powershell
corepack pnpm run verify
git diff --check
git status --short
```

Expected: 4 test files pass, typecheck and build exit 0, and the working tree is clean.

- [ ] **Step 2: Push the README and asset commits**

```powershell
git push origin main
```

Expected: `origin/main` advances to the local commit.

- [ ] **Step 3: Apply promotional repository metadata**

```powershell
gh repo edit Raphaelutumn/dsh-change-budget `
  --description "A configurable per-turn safety budget for DeepSeek Harness file mutations." `
  --homepage "https://github.com/Raphaelutumn/dsh-change-budget" `
  --add-topic deepseek `
  --add-topic deepseek-harness `
  --add-topic agent-safety `
  --add-topic coding-agent `
  --add-topic typescript `
  --add-topic plugin `
  --add-topic developer-tools `
  --add-topic guardrails
```

Expected: command exits 0.

- [ ] **Step 4: Read back the metadata**

```powershell
gh repo view Raphaelutumn/dsh-change-budget --json description,homepageUrl,repositoryTopics,url
```

Expected: exact description and homepage plus all eight topics.

### Task 5: Publish the v0.1.0 release

**Files:**
- Upload: `C:\Users\29648\Documents\Codex\2026-08-17\qi\outputs\dsh-change-budget-0.1.0.tgz`

- [ ] **Step 1: Verify the release asset**

```powershell
Get-FileHash -Algorithm SHA256 'C:\Users\29648\Documents\Codex\2026-08-17\qi\outputs\dsh-change-budget-0.1.0.tgz'
```

Expected SHA-256:

```text
41DE3F122BC5BBD0B459E75945C4D1ACF4E31E50F6AED9C62B00FAC8E9E5CC8C
```

- [ ] **Step 2: Create release notes**

Create `work/release-v0.1.0.md` outside the repository with:

```markdown
## dsh-change-budget v0.1.0

Put a hard, configurable budget on structured file mutations in every DeepSeek Harness Agent turn.

### Highlights

- Limits distinct files, mutation calls, and UTF-8 payload bytes independently.
- Reserves capacity synchronously so parallel calls cannot cross a limit together.
- Tracks `write`, `edit`, and `str_replace_editor` create/replace/insert operations.
- Resets per Agent on each new turn and releases failed tool reservations.
- Supports user-defined positive-integer limits.

### Install

```powershell
dsh plugin --profile web add .\dsh-change-budget-0.1.0.tgz
```

### Known limitations

Shell and PowerShell file mutations are not counted. Symlinks and junctions are not resolved to one physical file. Counters are in memory only.

### Integrity

SHA-256: `41DE3F122BC5BBD0B459E75945C4D1ACF4E31E50F6AED9C62B00FAC8E9E5CC8C`
```

- [ ] **Step 3: Create the GitHub release**

```powershell
gh release create v0.1.0 `
  'C:\Users\29648\Documents\Codex\2026-08-17\qi\outputs\dsh-change-budget-0.1.0.tgz#dsh-change-budget-0.1.0.tgz' `
  --repo Raphaelutumn/dsh-change-budget `
  --title "dsh-change-budget v0.1.0" `
  --notes-file 'C:\Users\29648\Documents\Codex\2026-08-17\qi\work\release-v0.1.0.md' `
  --target main
```

Expected: public release URL.

- [ ] **Step 4: Verify release and final repository state**

```powershell
gh release view v0.1.0 --repo Raphaelutumn/dsh-change-budget --json url,tagName,name,isDraft,isPrerelease,assets
git status --short
git rev-parse HEAD
git ls-remote origin refs/heads/main
```

Expected: release is public, not draft or prerelease, contains the tarball, the tree is clean, and local/remote main hashes match.
