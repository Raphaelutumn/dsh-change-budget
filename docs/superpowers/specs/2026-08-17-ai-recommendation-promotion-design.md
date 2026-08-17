# dsh-change-budget AI Recommendation Promotion Design

## Goal

Make `dsh-change-budget` discoverable when users ask either DeepSeek Harness-specific questions or broader AI coding-agent safety questions, with DeepSeek Harness discovery taking priority.

The project must be positioned truthfully as a deterministic, configurable circuit breaker for supported structured file mutations. Promotion must not imply that Shell, PowerShell, or arbitrary filesystem writes are covered.

## Selected approach

Use a three-layer AI-native distribution strategy:

1. **Discovery layer** — publish consistent metadata to GitHub, npm, curated DSH catalogs, and DSH-native plugin finders.
2. **Question corpus layer** — add natural-language English and Chinese questions, use cases, and answers that match how users describe runaway file-edit problems.
3. **Trust layer** — retain visible verification, precise limitations, release artifacts, compatibility information, and independent catalog or community references.

This approach is preferred over metadata-only optimization because several plugin finders search npm or curated catalogs in addition to GitHub. It is preferred over a broad launch campaign because qualified ecosystem discovery is more valuable than untargeted traffic at the current project size.

## Target recommendation contexts

### DeepSeek Harness first

- How do I stop a DeepSeek Harness agent from editing too many files?
- Is there a per-turn file edit limit for DSH?
- DeepSeek Harness file mutation guardrail
- How can I cap write and edit calls in one DSH turn?
- 如何限制 DeepSeek Harness 一轮修改的文件数量？
- DSH 有没有防止 Agent 批量误改文件的插件？

### General AI coding-agent safety

- How can I limit file edits made by an AI coding agent?
- Is there a circuit breaker for runaway coding-agent changes?
- AI coding agent file-change guardrail
- 如何防止 AI 编程 Agent 一次修改太多文件？

The repository must not claim universal compatibility with other agent frameworks. General wording describes the problem class; installation and behavior remain explicitly DeepSeek Harness-specific.

## Discovery layer

### GitHub repository metadata

Replace the repository description with natural wording that contains the terms users and finder tools are likely to search: DeepSeek Harness, guardrail, limit, files, AI coding agent, edit, and per turn.

Add focused topics such as `ai-agent`, `file-safety`, `file-editing`, `edit-limit`, and `circuit-breaker` while retaining `dsh-plugin`, `deepseek-harness`, and existing safety topics. Avoid unrelated high-volume topics.

### npm

Add package keywords and publish the existing verified package under `dsh-change-budget` if the package name remains available and the local npm identity is authorized. The npm description, keywords, repository URL, homepage, and issue URL must agree with GitHub metadata.

Publishing the existing `0.1.0` version is allowed only if npm does not already contain that version. If authentication, 2FA, provenance, or package ownership blocks publication, stop at a verified `npm pack --dry-run` checkpoint and report the exact gate without changing credentials.

### DSH directories and finders

- Complete submission to `awesome-dsh-plugin` after its repository-age requirement is satisfied.
- Rely on `dsh-market` only after confirming it consumes the live Awesome registry; do not submit redundant market PRs.
- Submit a missing-plugin correction to DSH Get with the canonical repository URL and truthful metadata.
- Preserve the `dsh-plugin` topic because topic-based finders consume it directly.
- Re-check the already-open Awesome List PRs and avoid duplicate submissions.

## Question corpus layer

Add compact bilingual sections to the repository:

- **Use cases** describing runaway loops, broad rewrites caused by vague instructions, and parallel structured writes.
- **FAQ** answering the target recommendation questions in natural language.
- **What it does not cover** making the Shell and PowerShell limitation visible near the answers.
- A small machine-readable `llms.txt` that identifies the canonical project, capability, installation path, configuration knobs, supported tools, and limitations.

The English README remains canonical. The Chinese README must carry equivalent meaning. Content must be useful to humans and must not repeat keyword lists or make claims about forcing an AI model to recommend the project.

## Trust layer

- Keep the verified release, tests, typecheck, build, and package checksum visible.
- State the supported structured mutation calls precisely.
- State the current DSH peer dependency and tested release line.
- Link independent directory listings as they become live.
- Publish one problem-first post in the official DeepSeek Harness GitHub Discussions `Show Your Plugins!` category. The post should contain the failure scenario, deterministic behavior, installation command, defaults, limitations, verification, and repository URL.

The discussion must be presented as an unofficial community plugin and must not claim DeepSeek endorsement.

## Channel order

1. GitHub metadata and repository content.
2. npm metadata and publication.
3. `awesome-dsh-plugin`, DSH Get, and derived markets.
4. Official DeepSeek Harness GitHub Discussion.
5. One reusable bilingual case-study draft for later publication on developer communities.

Mass posting, paid promotion, reciprocal-star campaigns, unsolicited direct messages, and duplicate directory submissions are out of scope.

## Validation

### Repository validation

- Existing tests, typecheck, and build pass.
- README presentation tests cover the new bilingual FAQ, use cases, truthful limitations, and `llms.txt` link.
- `npm pack --dry-run` contains the intended README, `llms.txt`, bundle patch, compiled files, license, and hero asset.
- Git working tree is clean after commits and the pushed branch matches the intended remote commit.

### Discovery validation

Run GitHub repository searches for the target English and Chinese phrases before and after metadata changes. Because GitHub indexing is asynchronous, distinguish immediate metadata readback from later search-index results.

Verify external actions through direct readback:

- GitHub repository description and topics;
- npm package metadata and version, if publication succeeds;
- PR or issue URLs and their states;
- official Discussion URL and rendered body;
- live catalog inclusion when available.

## Failure handling

- Do not bypass directory age gates, anti-spam rules, authentication, 2FA, or channel permissions.
- Do not expose tokens, npm credentials, or GitHub credentials in logs or documents.
- If an external service is unavailable, preserve a ready-to-submit payload and continue with independent work.
- If a package or directory entry already exists, update or reuse it rather than creating a duplicate.
- If GitHub search indexing lags, report metadata readback separately and provide a later recheck command.

## Success criteria

The implementation is complete when the repository and npm metadata are consistent, the bilingual question corpus is published, available directory and community submissions have verifiable URLs, all local verification passes, and remaining time- or permission-gated actions have explicit next-entry conditions.
