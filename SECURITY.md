# Security Policy

## Supported versions

Security fixes are applied to the latest `0.1.x` release and the current `main` branch. Older commits and unpublished builds are not supported release lines.

## Reporting a vulnerability

Use GitHub's [Private vulnerability reporting](https://github.com/Raphaelutumn/dsh-change-budget/security/advisories/new) and prefix the title with `[Security]`. Include:

- the affected version or commit;
- the DeepSeek Harness and Node.js versions;
- the operating system and installation method;
- a minimal reproduction;
- the expected and observed impact.

Do not include credentials, private repository content, or other secrets beyond what is necessary to reproduce the issue.

## Security scope

`dsh-change-budget` limits supported structured mutation calls before their tool bodies run. Shell, PowerShell, Bash, symlink aliases, junction aliases, and arbitrary command-based filesystem writes are outside its current coverage. These documented limitations are not, by themselves, security vulnerabilities.

The project does not claim to sandbox an Agent, authorize individual edits, persist counters across restarts, or replace operating-system access controls.

## Coordinated disclosure

Please keep a report private while it is being assessed and fixed. A public advisory or release note will describe confirmed impact and remediation when disclosure is appropriate.
