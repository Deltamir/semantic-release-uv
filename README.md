# ⚙️🐍 semantic-release-uv

A [semantic-release](https://semantic-release.gitbook.io/semantic-release/) plugin to publish Python packages built with [`uv`](https://github.com/astral-sh/uv).  
![NPM Version](https://img.shields.io/npm/v/%40open_resources%2Fsemantic-release-uv?logo=npm&link=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40open_resources%2Fsemantic-release-uv)
![Gitlab Pipeline Status](https://img.shields.io/gitlab/pipeline-status/open-resources%2Fsemantic-release-uv?logo=gitlab&link=https%3A%2F%2Fgitlab.com%2Fopen-resources%2Fsemantic-release-uv%2F-%2Fpipelines)
![Semantic Release](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)
![Gitlab Code Coverage](https://img.shields.io/gitlab/pipeline-coverage/open-resources%2Fsemantic-release-uv?branch=main&logo=vitest&link=https%3A%2F%2Fgitlab.com%2Fopen-resources%2Fsemantic-release-uv%2F-%2Fgraphs%2Fmain%2Fcharts)

## CI Environment

- [Node.js](https://semantic-release.gitbook.io/semantic-release/support/node-version) ≥ 18.0.0
- Python ≥ 3.9
- [`uv`](https://github.com/astral-sh/uv) installed and available in `PATH`

## Build System Interface

`semantic-release-uv` uses [`uv`](https://github.com/astral-sh/uv) to build and publish Python packages defined with `pyproject.toml`.

- Supports only [PEP 621](https://peps.python.org/pep-0621/)-compliant `pyproject.toml` configuration
- Does not support legacy `setup.py`/`setup.cfg`-based builds
- Requires `uv` to be installed and discoverable

## Steps

| Step              | Description |
|-------------------|-------------|
| `verifyConditions` | - Verify the presence and validity of `PYPI_TOKEN`<br>- Validate the `pyproject.toml` structure |
| `prepare`         | Update the version in `pyproject.toml`, locking and build the distribution with `uv` |
| `publish`         | Upload the package to PyPI or a custom index using `uv publish` |

## Environment Variables

| Variable         | Description                         | Required | Default |
|------------------|-------------------------------------|----------|---------|
| `PYPI_TOKEN`     | [API token](https://test.pypi.org/help/#apitoken) for PyPI                  | ✅       | —       |
| `PYPI_REPO_URL`  | Custom repository URL               | ❌       | `https://upload.pypi.org/legacy/` |
| `PYPI_USERNAME`  | Username for repository             | ❌       | `token` |

## Usage

Add the plugin to your semantic-release configuration:

```json
{
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@open_resources/semantic-release-uv"
  ]
}
```

Note that this plugin modifies the version inside of `pyproject.toml` and potentially change `uv.lock`. Make sure to commit pyproject.toml using the [@semantic-release/git](https://github.com/semantic-release/git) plugin, if you want to save the changes:

```json
{
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "semantic-release-uv",
    [
      "@semantic-release/git",
      {
        "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
        "assets": ["pyproject.toml", "uv.lock"],
      }
    ]
  ]
}
```

## Options

| Option         | Type      | Default                             | Description |
|----------------|-----------|-------------------------------------|-------------|
| `srcDir`       | `string`  | `.`                                 | Path to the project root |
| `distDir`      | `string`  | `dist`                              | Output directory for built distributions |
| `repoUrl`      | `string`  | `https://upload.pypi.org/legacy/`  | URL of the package index |

## Development

TODO

## License

[MIT License](LICENSE)

## Author Information

Deltamir - *ITN Security Expert, DevSecOps Engineer and Certified Pentester in a Telecom company*  
Contact via Github/Gitlab inbox
