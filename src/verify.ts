import TOML from "smol-toml";
import got, { RequestError } from "got";
import fs from "fs";
import FormData from "form-data";
import { DefaultConfig } from "./default-options";
import { PluginConfig } from "./types";
import { VerifyConditionsContext } from "semantic-release";

async function verify(
  pluginConfig: PluginConfig,
  context: VerifyConditionsContext
) {
  const { logger } = context;
  const { pyprojectPath, repoUrl } = new DefaultConfig(pluginConfig);

  const username = process.env["PYPI_USERNAME"]
    ? process.env["PYPI_USERNAME"]
    : "token";
  const repo = process.env["PYPI_REPO_URL"] ?? repoUrl;
  const token = process.env["PYPI_TOKEN"];

  if (!process.env["PYPI_TOKEN"]) {
    throw new Error("Environment variable PYPI_TOKEN is not set");
  }

  logger.log(`Verifying authentication for ${username}@${repo}`);

  const form = new FormData();
  form.append(":action", "file_upload");
  const basicAuth = Buffer.from(`${username}:${token}`).toString("base64");
  const headers = {
    Authorization: `Basic ${basicAuth}`,
  };

  try {
    await got(repo, {
      method: "post",
      headers: Object.assign(headers, form.getHeaders()),
      body: form,
    });
  } catch (err: typeof RequestError | unknown) {
    if (err instanceof RequestError && err.response && err.response.statusCode === 403) {
      throw err;
    } 
  }

  let toml: string;
  logger.log("Parsing pyproject.toml");
  try {
    toml = fs.readFileSync(pyprojectPath, {
      encoding: "utf8",
      flag: "r",
    });
  } catch (err) {
    throw new Error(`Error reading ${pyprojectPath}: ${err}`);
  }
  const pyproject = TOML.parse(toml);
  const version = (pyproject.project as { version: string })?.version;
  if (!version) {
    throw new Error("Could not find version in pyproject.toml");
  }
}

export { verify };
