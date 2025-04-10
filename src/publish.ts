// @ts-ignore
import TOML from "smol-toml";
import fs from "fs";
import { Options } from "execa";
import { normalizeVersion, spawn } from "./utils.ts";
import { DefaultConfig } from "./default-options.ts";
import { PluginConfig } from "./types.ts";
import { PublishContext } from "semantic-release";

async function publish(pluginConfig: PluginConfig, context: PublishContext) {
  const { logger } = context;
  const { srcDir, distDir, repoUrl } = new DefaultConfig(pluginConfig);

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

  await spawn(
    "uv",
    ["publish", "--publish-url", repo, "--username", username, "--token", token as string],
    execaOptions,
  );

}
export { publish };
