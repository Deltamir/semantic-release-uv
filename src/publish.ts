import { Options } from "execa";
import { spawn } from "./utils";
import { DefaultConfig } from "./default-options";
import { PluginConfig } from "./types";
import { PublishContext } from "semantic-release";

async function publish(pluginConfig: PluginConfig, context: PublishContext) {
  const { logger } = context;
  const { repoUrl } = new DefaultConfig(pluginConfig);

  logger.log(`Publishing package to ${repoUrl}`);

  const execaOptions: Options = {
    stdout: context.stdout,
    stderr: context.stderr,
  };

  const username = process.env["PYPI_USERNAME"]
    ? process.env["PYPI_USERNAME"]
    : "token";
  const repo = process.env["PYPI_REPO_URL"] ?? repoUrl;
  const token = process.env["PYPI_TOKEN"];

  if (!process.env["PYPI_TOKEN"]) {
    throw new Error("Environment variable PYPI_TOKEN is not set");
  }

  await spawn("uv", execaOptions, [
    "publish",
    "--publish-url",
    repo,
    "--username",
    username,
    "--token",
    token as string,
  ]);
}
export { publish };
