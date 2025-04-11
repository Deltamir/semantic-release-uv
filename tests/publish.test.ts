import { describe, it, expect, vi, beforeEach } from "vitest";
import { publish } from "../src/publish";
import * as utils from "../src/utils";
import { PublishContext } from "semantic-release";

// Mock de spawn
vi.mock("../src/utils", () => ({
  spawn: vi.fn(),
}));

describe("publish function", () => {
  const mockSpawn = utils.spawn as unknown as ReturnType<typeof vi.fn>;
  const context: PublishContext = {
    logger: { log: vi.fn() },
  } as PublishContext;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env["PYPI_USERNAME"] = "user";
    process.env["PYPI_REPO_URL"] = "http://pypi.mockup.com";
    process.env["PYPI_TOKEN"] = "token";
  });

  it("should throw an error if PYPI_TOKEN is not set", async () => {
    delete process.env["PYPI_TOKEN"];
    const pluginConfig = {};

    await expect(publish(pluginConfig, context)).rejects.toThrow(
      "Environment variable PYPI_TOKEN is not set"
    );
  });

  it("should call spawn with proper arguments (env vars provided)", async () => {
    const pluginConfig = {};
    mockSpawn.mockResolvedValue({ stdout: "" });

    await publish(pluginConfig, context);

    expect(mockSpawn).toHaveBeenCalledWith(
      "uv",
      {
        stdout: undefined,
        stderr: undefined,
      },
      [
        "publish",
        "--publish-url",
        "http://pypi.mockup.com",
        "--username",
        "user",
        "--token",
        "token",
      ]
    );
  });

  it("should fallback to default username and repoUrl if env not set", async () => {
    delete process.env["PYPI_USERNAME"];
    delete process.env["PYPI_REPO_URL"];
    process.env["PYPI_TOKEN"] = "token";

    const pluginConfig = {};
    mockSpawn.mockResolvedValue({ stdout: "" });

    await publish(pluginConfig, context);

    expect(mockSpawn).toHaveBeenCalledWith(
      "uv",
      expect.anything(),
      expect.arrayContaining(["--username", "token"])
    );
  });
});
