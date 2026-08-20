# GitHub Discovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve repository trust and conversion with visible CI, a short proof demo, compatibility documentation, and a pinned GitHub profile entry.

**Architecture:** Keep the runtime plugin unchanged. Add a GitHub Actions workflow for the existing `verify` command, extend the existing bilingual README and runtime demo materials, and use GitHub's profile UI only for the account-level pin.

**Tech Stack:** GitHub Actions, pnpm/Corepack, Vitest, Markdown, SVG, GitHub profile UI

---

### Task 1: Define the repository presentation checks

**Files:**
- Modify: `tests/readme.spec.ts`

- [x] Add checks for the CI badge, 30-second demo, before/after example, and compatibility matrix.
- [x] Add checks for the workflow Node matrix and `corepack pnpm run verify` command.
- [x] Run `corepack pnpm test tests/readme.spec.ts` and confirm the new checks fail because the content is absent.

### Task 2: Add continuous integration

**Files:**
- Create: `.github/workflows/ci.yml`
- Modify: `README.md`
- Modify: `README.zh.md`

- [x] Add a least-privilege workflow for pull requests and main-branch pushes.
- [x] Test Node 20, 22, and 24 with Corepack and the frozen lockfile.
- [x] Run the existing `verify` script and add the workflow badge to both READMEs.

### Task 3: Improve the short proof demo and compatibility guidance

**Files:**
- Modify: `README.md`
- Modify: `README.zh.md`
- Modify: `docs/promotion/demo.md`

- [x] Add a 30-second path from clone to visible rejection.
- [x] Add a concise without/with comparison using the real runtime demo behavior.
- [x] Add a compatibility matrix with tested and documented support levels.
- [x] Reuse the existing terminal SVG, which is generated from the runnable demo evidence.

### Task 4: Verify, publish, and pin

**Files:**
- Verify all changed files.

- [x] Run the focused README tests and the full `corepack pnpm run verify` command.
- [x] Run `git diff --check` and inspect the final diff.
- [ ] Commit and push the changes to `origin/main`.
- [ ] Confirm the GitHub Actions run passes.
- [ ] Pin `Raphaelutumn/dsh-change-budget` to the authenticated GitHub profile and read back the pinned list.
