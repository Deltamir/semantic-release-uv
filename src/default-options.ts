import path from "path";
import { PluginConfig } from "./types.js";

export class DefaultConfig {
  config: PluginConfig;

  constructor(config: PluginConfig) {
    this.config = config;
  }

  public get srcDir() {
    return this.config.srcDir ?? ".";
  }

  public get pyprojectPath(): string {
    return path.join(this.srcDir, "pyproject.toml");
  }

  public get distDir() {
    return this.config.distDir ?? "dist";
  }

  public get repoUrl() {
    return this.config.repoUrl ?? "https://upload.pypi.org/legacy/";
  }
}
