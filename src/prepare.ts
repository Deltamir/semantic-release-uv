// @ts-ignore
import TOML from "smol-toml";
import fs from "fs";
import { Options } from "execa";
import { normalizeVersion, spawn } from "./utils.ts";
import { DefaultConfig } from "./default-options.ts";
import { PluginConfig } from "./types.ts";
import { PrepareContext } from "semantic-release";

async function prepare(pluginConfig: PluginConfig, context: PrepareContext) {
  const { logger, nextRelease } = context;
  const { distDir, pyprojectPath } = new DefaultConfig(pluginConfig);

  if (nextRelease === undefined) {
    throw new Error("nextRelease is undefined");
  }

  let execaOptions: Options = {
    stdout: context.stdout,
    stderr: context.stderr,
  };

  const version = await normalizeVersion(nextRelease.version, execaOptions);

  logger.log(`Setting version to ${version} in pyproject.toml`);
  const toml = fs.readFileSync(pyprojectPath, {
    encoding: "utf8",
    flag: "r",
  });
  const pyproject = TOML.parse(toml);

  pyproject["project"]["version"] = version;

  fs.writeFileSync(pyprojectPath, TOML.stringify(pyproject), {
    encoding: "utf8",
    flag: "w",
  });

  logger.log(`Locking dependencies`);
  await spawn("uv", ["lock"], execaOptions);

  logger.log(`Building distribution in ${distDir}`);
  await spawn("uv", ["build", distDir], execaOptions);
}

export { prepare };
