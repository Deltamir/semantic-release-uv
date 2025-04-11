import { describe, it, expect, vi, beforeEach } from "vitest";
import { verify } from "../src/verify"; // Replace with the actual path
import { VerifyConditionsContext } from "semantic-release";
import { vol } from "memfs";


// Mock fs everywhere else with the memfs version.
vi.mock("fs", async () => {
  const memfs = await vi.importActual("memfs");
  return { default: memfs.fs, ...memfs.fs as object};
});


describe("verify function", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env["PYPI_USERNAME"] = "user";
    process.env["PYPI_REPO_URL"] = "http://pypi.mockup.com";
    process.env["PYPI_TOKEN"] = "token";
    vol.reset()
  });

  it("should throw an error if PYPI_TOKEN is not set", async () => {
    delete process.env["PYPI_TOKEN"];

    const context = { logger: { log: vi.fn() } } as VerifyConditionsContext;
    const pluginConfig = {};

    await expect(verify(pluginConfig, context)).rejects.toThrow(
      "Environment variable PYPI_TOKEN is not set"
    );
  });

  it("should throw an error if the request fails with 403 (using env var)", async () => {
    process.env["PYPI_REPO_URL"] += "/403";
    const context = { logger: { log: vi.fn() } } as VerifyConditionsContext;
    const pluginConfig = {};

    await expect(verify(pluginConfig, context)).rejects.toThrow(
      "Response code 403 (Forbidden)"
    );
  });

  it("should parse pyproject.toml and throw error if pyproject.toml is not found", async () => {
    const context = { logger: { log: vi.fn() } } as VerifyConditionsContext;
    const pluginConfig = {};

    await expect(verify(pluginConfig, context)).rejects.toThrow(
      "Error reading pyproject.toml"
    );
  });

  it("should parse pyproject.toml and throw error if version is not found", async () => {
    const context = { logger: { log: vi.fn() } } as VerifyConditionsContext;
    const pluginConfig = {};

    vol.fromJSON(
      {
        'pyproject.toml': '[project]\nname = "my-project"\nnot-version = "1.0.0"',
      },
    )

    await expect(verify(pluginConfig, context)).rejects.toThrow(
      "Could not find version in pyproject.toml"
    );
  });

  it("should verify authentication (without env var) and extract version from pyproject.toml without error", async () => {
    delete process.env["PYPI_REPO_URL"];
    delete process.env["PYPI_USERNAME"];
    const context = { logger: { log: vi.fn() } } as VerifyConditionsContext;
    const pluginConfig = {};

    vol.fromJSON(
      {
        'pyproject.toml': '[project]\nname = "my-project"\nversion = "1.0.0"',
      },
    )

    await expect(verify(pluginConfig, context)).resolves.not.toThrow();
  });

  it("should verify authentication without failure if code is not 403", async () => {
    delete process.env["PYPI_REPO_URL"];
    delete process.env["PYPI_USERNAME"];
    const context = { logger: { log: vi.fn() } } as VerifyConditionsContext;
    const pluginConfig = {};

    vol.fromJSON(
      {
        'pyproject.toml': '[project]\nname = "my-project"\nversion = "1.0.0"',
      },
    )

    await expect(verify(pluginConfig, context)).resolves.not.toThrow();
  });

  
  it("should verify authentication without failure even if code is not 403", async () => {
    process.env["PYPI_REPO_URL"] += "/404";
    const context = { logger: { log: vi.fn() } } as VerifyConditionsContext;
    const pluginConfig = {};

    vol.fromJSON(
      {
        'pyproject.toml': '[project]\nname = "my-project"\nversion = "1.0.0"',
      },
    )

    await expect(verify(pluginConfig, context)).resolves.not.toThrow();
  });

});
