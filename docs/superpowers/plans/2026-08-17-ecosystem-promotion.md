# Ecosystem Promotion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put `dsh-change-budget` into the primary DeepSeek Harness plugin discovery channels to increase qualified GitHub Stars.

**Architecture:** Apply owned-repository metadata directly, then create narrowly scoped upstream listing PRs from user-owned forks. Treat `awesome-dsh-plugin` as the source of truth for `dsh-market`, and use an authenticated browser session only for the official Discord post.

**Tech Stack:** GitHub CLI, Git, Markdown, Discord web client

---

### Task 1: Verify submission targets and duplicate state

**Files:**
- Read: each target repository's `README` and contribution guide

- [ ] Inspect current contribution rules, categories, generated-file requirements, and existing entries.
- [ ] Verify that `Raphaelutumn/dsh-change-budget` is not already listed.
- [ ] Run the plugin's existing verification command as current evidence for the listings.

### Task 2: Add the official discovery topic

**Files:**
- No local file changes.

- [ ] Run `gh repo edit Raphaelutumn/dsh-change-budget --add-topic dsh-plugin`.
- [ ] Read back `repositoryTopics` and confirm `dsh-plugin` is present.

### Task 3: Submit the primary curated-list PR

**Files:**
- Modify: the exact catalog file required by `awesome-dsh-plugin/awesome-dsh-plugin`

- [ ] Fork and clone the repository under the user's GitHub account.
- [ ] Add one truthful entry in the correct category using the repository's required format.
- [ ] Run the repository's lint or catalog validation command.
- [ ] Commit, push, and open a focused PR with verification evidence.

### Task 4: Submit the two secondary awesome-list PRs

**Files:**
- Modify: the exact list file required by `Anil-matcha/awesome-deepseek-harness`
- Modify: the exact list file required by `0xsline/awesome-deepseek-harness`

- [ ] Repeat each repository's documented fork, edit, validation, commit, push, and PR workflow.
- [ ] Skip any target that is archived, closed to submissions, or already contains the plugin, and record the reason.

### Task 5: Confirm dsh-market ingestion path

**Files:**
- No direct `dsh-market` catalog change unless its current documentation explicitly requires one.

- [ ] Verify that the market reads from the primary curated catalog.
- [ ] Do not open a redundant market PR when upstream inclusion is the documented route.
- [ ] After the primary PR is merged, check the public catalog/market entry; until then, report it as pending upstream review.

### Task 6: Publish the official Discord launch

**Files:**
- Create outside the repository if needed: a temporary bilingual launch draft.

- [ ] Open the official Discord invite in an existing authenticated browser session.
- [ ] Select the appropriate plugin/showcase channel and post one concise bilingual message containing the problem hook, repository URL, install path, and limitations.
- [ ] Verify the posted message. If authentication or channel permission is unavailable, preserve the copy for manual posting and make no attempt to bypass access controls.

### Task 7: Final verification

**Files:**
- No additional repository changes.

- [ ] Read back the topic and every PR state/URL through GitHub CLI.
- [ ] Confirm local `main` is clean and synchronized after committing these planning documents.
- [ ] Report completed, pending-review, automatically downstream, and blocked items separately.
