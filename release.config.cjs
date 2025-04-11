/**
 * @type {import('semantic-release').GlobalConfig}
 */

const project_url = process.env.CI_PROJECT_URL;
const branch_name = process.env.CI_COMMIT_BRANCH;

module.exports = {
  branches: [
    "main",
    {
      name: "beta",
      prerelease: "rc",
    },
  ],
  tagFormat: "${version}",
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    ...(branch_name === "main" ? ["@semantic-release/changelog"] : []),
    "@semantic-release/npm",
    [
      "@semantic-release/gitlab",
      {
        assets: [
          {
            path: "report/node-sbom.cyclonedx.json",
            label: "Software Bill Of Material",
          },
          {
            path: "report/node-lint.gitlab.json",
            label: "Code Quality Report",
          },
          {
            path: "report/node-audit.json",
            label: "NPM audit Report",
          },
          {
            path: "report/cobertura-coverage.xml",
            label: "Code Coverage Report",
          },
          {
            path: "report/junit.xml",
            label: "Test Report",
          },
          {
            url: project_url + "/-/blob/${nextRelease.version}/README.md",
            label: "Documentation",
          },
        ],
      },
    ],
    [
      "@semantic-release/git",
      {
        message:
          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
        assets: ["CHANGELOG.md", "package.json", "yarn.lock"],
      },
    ],
  ],
};
