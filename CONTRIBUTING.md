# Contributing to dsh-change-budget

Thanks for helping improve `dsh-change-budget`. Focused bug reports, compatibility evidence, documentation fixes, and small pull requests are welcome.

## Before opening an issue

- Use the bug form for a reproducible failure in supported structured mutation handling.
- Use the compatibility form when reporting a DeepSeek Harness, Node.js, operating-system, or installation combination.
- Use Discussions for design questions, configuration trade-offs, and ideas that are not yet actionable defects.
- Use Private vulnerability reporting for security or conduct reports. Do not disclose secrets or vulnerabilities in a public issue.

Shell, PowerShell, Bash, and arbitrary command-based filesystem writes are outside the plugin's current coverage. A report about those paths can still be useful as a feature proposal, but it is not a regression in the existing structured mutation budget.

## Development setup

```powershell
git clone https://github.com/Raphaelutumn/dsh-change-budget.git
Set-Location dsh-change-budget
corepack pnpm install --frozen-lockfile
corepack pnpm run verify
```

Run the focused runtime proof with:

```powershell
corepack pnpm demo
```

## Pull requests

Keep each pull request limited to one behavior or documentation outcome. Before submitting:

1. Add or update tests for behavior changes.
2. Run `corepack pnpm run verify`.
3. Run `git diff --check`.
4. Update both `README.md` and `README.zh.md` when user-facing behavior changes.
5. Document every newly supported structured mutation tool, including its path and payload fields.

Do not broaden security claims beyond behavior demonstrated by tests and the runtime demo.
