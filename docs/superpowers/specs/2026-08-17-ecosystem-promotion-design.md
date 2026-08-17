# dsh-change-budget Ecosystem Promotion Design

## Goal

Increase qualified GitHub Stars by placing `dsh-change-budget` in the discovery paths already used by DeepSeek Harness developers.

## Selected approach

Use an ecosystem-first launch:

1. Add the official `dsh-plugin` GitHub topic.
2. Submit a precise listing to the maintained DeepSeek Harness plugin directories.
3. Let `dsh-market` ingest the plugin through its documented upstream catalog rather than opening an invalid market PR.
4. Publish one concise bilingual launch message in the official DeepSeek Harness Discord if an authenticated Discord session is available.

## Listing message

Use one verifiable description everywhere:

> Configurable per-turn safety budgets for DeepSeek Harness file mutations, limiting distinct files, mutation calls, and UTF-8 payload bytes before supported tool bodies run.

Do not claim coverage for Shell or PowerShell writes, persistence across restarts, or official DeepSeek endorsement.

## Submission rules

- Follow each target repository's current contribution instructions and category taxonomy.
- Avoid duplicate submissions where the plugin is already listed.
- Keep each PR limited to one listing entry and any required generated index updates.
- Link to the public repository and use the existing release/install instructions as proof.
- Do not open a direct PR to `dsh-market` when its documentation says the catalog is synchronized from `awesome-dsh-plugin`.

## Verification

- Read back repository topics through GitHub CLI.
- Record every opened PR URL and confirm it is open with the expected base and head branches.
- Confirm whether the upstream catalog automatically feeds `dsh-market`.
- For Discord, verify the message appears in the intended official community channel; if no authenticated session is available, stop without bypassing authentication and provide the ready-to-post copy.

## Non-goals

- No paid promotion, mass unsolicited outreach, artificial Stars, or reciprocal-star campaigns.
- No runtime or package changes.
- No misleading security guarantees.
