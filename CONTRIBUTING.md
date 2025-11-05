<!-- omit in toc -->
# Contributing to @open_resources/semantic-release-uv

Thanks for your interest in contributing! This repository contains a TypeScript plugin for
[semantic-release](https://semantic-release.gitbook.io/semantic-release/). The guideline below
explains how to report issues, propose enhancements, and submit code changes.

<!-- omit in toc -->
## Table of Contents

- [Getting started (dev setup)](#getting-started-dev-setup)
- [Reporting bugs](#reporting-bugs)
- [Suggesting enhancements](#suggesting-enhancements)
- [Pull requests \& workflow](#pull-requests--workflow)
- [Style and tests](#style-and-tests)
- [Security](#security)
- [Attribution](#attribution)

## Getting started (dev setup)

Requirements

1. Node.js >= 18

1. Yarn (this repository uses the Plug'n'Play yarn v4 lockfile)

Quick start (recommended: use the included devcontainer)

1. Open the repository in the included development container in VS Code (Reopen in Container)
  or use the Dev Container CLI to build/start it. The devcontainer installs and configures the
  project's tools (including `pre-commit`) so your environment matches CI.

1. Inside the devcontainer, install dependencies:

  yarn install

1. Ensure pre-commit hooks are installed (the devcontainer will usually do this). To install
  manually inside the devcontainer run:

  pre-commit install

  and to run all hooks once:

  pre-commit run --all-files

1. Run tests:

  yarn test

1. Lint and format checks:

  yarn lint

See `package.json` for the full list of scripts. The project uses TypeScript, ESLint and Prettier.

## Reporting bugs

Before filing a bug report please:

- Check open issues for duplicates.
- Try to reproduce using the latest release/main branch.
- Collect: Node.js version, OS, relevant environment variables,
  a minimal reproduction (pyproject.toml, commands you ran) and the exact error output.

When opening an issue, include a clear title, the expected behavior, the actual behavior and
minimal reproduction steps.

## Suggesting enhancements

Enhancement requests are welcome. When proposing a new feature:

- Explain the problem you are trying to solve and why the change benefits most users.
- Provide examples of configuration and expected outcome where appropriate.
- If possible, submit a draft PR with a small implementation or a spike branch to discuss.

## Pull requests & workflow

We use GitHub/GitLab issues and pull/merge requests to accept code. Follow these guidelines:

- Create an issue for larger changes before starting work to discuss the approach.
- Branch from `beta` and open your merge/pull request against `beta` (this repository uses `beta`
  as the pre-release integration branch). If a hotfix must go directly to `main` a maintainer will
  explicitly request that.
- Keep PRs small and focused. One feature or bug per PR is ideal.
- Use Conventional Commits for commit messages (see below).

When your PR is ready it will be reviewed by maintainers. CI runs will check tests and lint.

## Style and tests

Code style

- The project uses Prettier and ESLint. Run `yarn lint` and `yarn lint:fix` to apply fixes.

Tests

- Unit tests are run with Vitest. Run `yarn test` locally.

Coverage (mandatory)

- This project requires 100% code coverage for all new and changed code. CI will reject
  merge requests that reduce coverage or fail to meet 100% coverage. Run the coverage task and
  inspect the summary before opening a PR:

  yarn coverage

  The coverage summary must show 100% for lines, functions and branches for the files changed.

Commit messages

- Please follow the [Conventional Commits](https://conventionalcommits.org/) specification.

Examples:

- feat(prepare): handle editable installs
- fix(publish): retry on transient PyPI errors
- chore(release): 1.2.0

## Security

Do not open security-related issues in the public issue tracker. If you discover a security
vulnerability, contact a repository maintainer privately (GitHub/GitLab inbox) so it can be
handled responsibly.

## Attribution

This project is authored by Deltamir and maintained under the MIT license. See `LICENSE` for
details.

Thank you for contributing — your help improves the project for everyone!
