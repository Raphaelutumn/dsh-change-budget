# Community Discovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the repository's community contribution surfaces, improve topic discovery, and open one useful technical Discussion.

**Architecture:** Keep runtime code unchanged. Treat community files as a tested repository presentation surface, update GitHub metadata through the authenticated CLI, and verify every remote mutation through GitHub APIs.

**Tech Stack:** Markdown, GitHub Issue Forms, Vitest, GitHub CLI, GitHub GraphQL API

---

### Task 1: Define community-file requirements

**Files:**
- Modify: `tests/readme.spec.ts`

- [ ] Add assertions for the contribution guide, code of conduct, security policy, issue forms, and pull request template.
- [ ] Run the focused test and confirm it fails because the files do not exist.

### Task 2: Add community health files

**Files:**
- Create: `CONTRIBUTING.md`
- Create: `CODE_OF_CONDUCT.md`
- Create: `SECURITY.md`
- Create: `.github/ISSUE_TEMPLATE/bug.yml`
- Create: `.github/ISSUE_TEMPLATE/compatibility.yml`
- Create: `.github/ISSUE_TEMPLATE/config.yml`
- Create: `.github/pull_request_template.md`

- [ ] Add concise project-specific contribution and security instructions.
- [ ] Add structured forms for bugs and compatibility reports.
- [ ] Run focused and full verification.

### Task 3: Publish repository changes

**Files:**
- Commit all files from Tasks 1 and 2.

- [ ] Run `git diff --check` and inspect the final diff.
- [ ] Push the verified commit to `origin/main`.
- [ ] Confirm CI completes successfully.

### Task 4: Update GitHub discovery and conversation surfaces

**Files:**
- No local files.

- [ ] Add the `dsh`, `ai-coding-agent`, `agent-guardrails`, and `tool-safety` topics.
- [ ] Enable Discussions and private vulnerability reporting.
- [ ] Create one technical Discussion in the general category.
- [ ] Read back topics, community health, security setting, Discussion, and CI state.
