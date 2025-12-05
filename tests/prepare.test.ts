import { describe, it, expect, vi, beforeEach } from "vitest";
import { prepare } from "../src/prepare";
import { vol } from "memfs";
import * as utils from "../src/utils";
import fs from "fs";
import { PrepareContext, NextRelease } from "semantic-release";

// Mock fs avec memfs
vi.mock("fs", async () => {
  const memfs = await vi.importActual("memfs");
  return { default: memfs.fs, ...(memfs.fs as object) };
});

// Mock des fonctions utilitaires
vi.mock("../src/utils", () => ({
  normalizeVersion: vi.fn(),
  spawn: vi.fn(),
}));

describe("prepare function", () => {
  const fakeContext = {
    nextRelease: {
      version: "1.2.3",
      type: "major", // or "minor", "patch", etc.
    } as NextRelease,
    logger: { log: vi.fn() },
  } as PrepareContext;
  beforeEach(() => {
    vi.clearAllMocks();
    vol.reset();
    vol.fromJSON({
      "pyproject.toml": `[project]\nname = "test-pkg"\nversion = "0.1.0"`,
    });
    process.env["PYPI_USERNAME"] = "user";
    process.env["PYPI_REPO_URL"] = "http://pypi.mockup.com";
    process.env["PYPI_TOKEN"] = "token";
  });

  it("should throw an error if nextRelease is undefined", async () => {
    const context = { ...fakeContext, nextRelease: undefined };
    const pluginConfig = {};

    await expect(
      prepare(pluginConfig, context as unknown as PrepareContext)
    ).rejects.toThrow("nextRelease is undefined");
  });

  it("should update the version in pyproject.toml and call spawn", async () => {
    const pluginConfig = {};
    const mockNormalize = utils.normalizeVersion as unknown as ReturnType<
      typeof vi.fn
    >;
    const mockSpawn = utils.spawn as unknown as ReturnType<typeof vi.fn>;

    mockNormalize.mockReturnValueOnce("1.2.3");

    mockSpawn.mockResolvedValue({ stdout: "" });

    await expect(prepare(pluginConfig, fakeContext)).resolves.not.toThrow();

    const updatedToml = fs.readFileSync("pyproject.toml", "utf-8");
    expect(updatedToml).toMatch(/version = "1.2.3"/);

    expect(utils.normalizeVersion).toHaveBeenCalledWith("1.2.3");

    expect(utils.spawn).toHaveBeenCalledWith(
      "uv",
      { stdout: undefined, stderr: undefined },
      ["lock"]
    );
    expect(utils.spawn).toHaveBeenCalledWith(
      "uv",
      { stdout: undefined, stderr: undefined },
      ["build", "dist"]
    );
  });

  it("should fail if pyproject.toml is invalid", async () => {
    vol.fromJSON({
      "pyproject.toml": `invalid = [oops`, // bad TOML
    });

    const pluginConfig = {};
    (
      utils.normalizeVersion as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce("1.2.3");

    await expect(prepare(pluginConfig, fakeContext)).rejects.toThrow();
  });
});
