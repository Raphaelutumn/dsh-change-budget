# Community Discovery Design

## Goal

Turn repository visitors into informed users and contributors by completing GitHub's community surfaces and opening one focused technical conversation.

## Repository files

- `CONTRIBUTING.md` defines a small, verifiable contribution path and keeps behavior claims tied to tests.
- `CODE_OF_CONDUCT.md` uses the Contributor Covenant and routes private conduct reports through GitHub private reporting with a `[Conduct]` title prefix.
- `SECURITY.md` defines supported versions, scope, and private vulnerability reporting.
- Issue forms separate reproducible bugs from environment compatibility reports.
- The pull request template requires scope, verification, and documentation of new mutation-tool coverage.

## Discovery metadata

Keep the existing precise topics and add `dsh`, `ai-coding-agent`, `agent-guardrails`, and `tool-safety`. These terms are accurate for the repository and connect it to broader GitHub topic pages without changing product claims.

## Discussions

Enable repository Discussions and publish one technical post in the general category: “How should a coding agent handle a per-turn file-edit budget?” The post states current behavior and limitations, then asks for concrete configuration and compatibility feedback. It must not imply official endorsement or broader tool coverage.

## Verification

- Test the presence and required content of every community file before implementation.
- Run the full project verification and `git diff --check` before pushing.
- Read back the GitHub community profile, topics, private reporting state, discussion URL, and latest CI run.

## Non-goals

- No GitHub Pages, social preview, new release, artificial engagement, or additional catalog submission.
- No runtime behavior or package API changes.
