import TOML from "smol-toml";
import fs from "fs";
import { Options } from "execa";
import { getUvPath, normalizeVersion, spawn } from "./utils";
import { DefaultConfig } from "./default-options";
import { PluginConfig } from "./types";
import { PrepareContext } from "semantic-release";

async function prepare(pluginConfig: PluginConfig, context: PrepareContext) {
  const { logger, nextRelease } = context;
  const { pyprojectPath } = new DefaultConfig(pluginConfig);

  if (nextRelease === undefined) {
    throw new Error("nextRelease is undefined");
  }

  const execaOptions: Options = {
    stdout: context.stdout,
    stderr: context.stderr,
  };

  const version = normalizeVersion(nextRelease.version);
  const uv = getUvPath();

  logger.log(`Setting version to ${version} in pyproject.toml`);
  const toml = fs.readFileSync(pyprojectPath, {
    encoding: "utf8",
    flag: "r",
  });
  const pyproject = TOML.parse(toml);

  (pyproject.project as { version: string }).version = version;

  fs.writeFileSync(pyprojectPath, TOML.stringify(pyproject), {
    encoding: "utf8",
    flag: "w",
  });

  logger.log(`Locking dependencies`);
  await spawn(uv, execaOptions, ["lock"]);

  logger.log(`Building distribution`);
  await spawn(uv, execaOptions, ["build"]);
}

export { prepare };
