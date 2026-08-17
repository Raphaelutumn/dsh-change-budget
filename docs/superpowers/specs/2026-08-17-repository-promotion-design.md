# dsh-change-budget Repository Promotion Design

## Goal

Turn the GitHub repository into a clear promotional landing page for developers who use DeepSeek Harness. The presentation should communicate the safety problem, explain the plugin in under one minute, and make installation immediately actionable without changing plugin behavior.

## Audience and message

The primary audience is DeepSeek Harness users who run coding Agents and want protection against accidental broad file edits. The central message is:

> Put a hard, configurable budget on every Agent turn before structured file mutations run.

The tone is technical, concise, trustworthy, and open-source friendly. Claims must remain limited to behavior covered by the current implementation and tests.

## Considered approaches

1. Minimal documentation polish: badges and reordered sections. Lowest effort, but visually undifferentiated and weak for social sharing.
2. Developer-tool launch page: branded hero banner, concise value proposition, workflow diagram, proof points, installation, configuration, limitations, topics, and a release. This is the selected approach because it balances promotion with technical credibility.
3. Marketing microsite: a separate interactive website. Rejected because it adds hosting and maintenance without improving the plugin itself.

## Visual direction

- Use a dark deep-ocean palette with electric blue and cyan highlights.
- Use an abstract budget gauge, guarded file cards, and bounded flow lines as the visual metaphor.
- Do not use the official DeepSeek logo or imply official endorsement.
- The hero image must remain legible at GitHub README width and when cropped for sharing.
- Keep exact product text outside the generated artwork where practical so README typography stays crisp and accessible.

## README structure

Both `README.md` and `README.zh.md` will use the same information hierarchy:

1. Hero banner
2. Language switch and repository badges
3. One-sentence promise
4. Three compact proof points: per-turn isolation, synchronous parallel reservations, configurable limits
5. A small Mermaid workflow showing classification, reservation, execution, and settlement
6. Quick install
7. Configuration table and override example
8. Counted tools and precise accounting behavior
9. Rejection example
10. Limitations
11. Development and contribution information

The English README remains GitHub's default landing page. The Chinese README is a complete counterpart rather than a partial translation.

## Repository metadata

- Description: a short safety-focused summary mentioning DeepSeek Harness.
- Topics: `deepseek`, `deepseek-harness`, `agent-safety`, `coding-agent`, `typescript`, `plugin`, `developer-tools`, and `guardrails`.
- Homepage: point to the repository until a dedicated project page exists.
- Release: publish `v0.1.0` with concise notes, installation guidance, supported calls, known limitations, and the verified tarball asset.

## Assets

Create one project-bound raster hero banner under `assets/`. It must contain no logo, watermark, or small body copy. The README will provide all detailed text and accessibility alt text.

## Verification

- Render and visually inspect the banner.
- Validate both README files contain equivalent sections and valid relative asset links.
- Run the existing 15-test suite, typecheck, and build to prove presentation changes did not affect behavior.
- Verify the GitHub description, homepage, topics, release tag, release notes, and uploaded tarball through GitHub CLI readback.
- Confirm the repository working tree is clean and local `main` matches `origin/main`.

## Non-goals

- No plugin runtime behavior changes.
- No official-brand impersonation.
- No separate website, analytics, paid promotion, package-registry publication, or automated social posting.
- No claims that Shell or PowerShell mutations are covered.
