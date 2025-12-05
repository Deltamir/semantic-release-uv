import { describe, it, expect, vi, beforeEach } from "vitest";
import { ensureUv, normalizeVersion, spawn } from "../src/utils";
import { execa } from "execa";

vi.mock("execa");

describe("ensureUv", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return success with installed=false if uv is already available", async () => {
    const mockExeca = execa as unknown as ReturnType<typeof vi.fn>;
    mockExeca.mockResolvedValueOnce({ stdout: "uv 0.1.0" });

    const logger = { log: vi.fn() };
    const result = await ensureUv(logger);

    expect(result).toEqual({ success: true, installed: false });
    expect(mockExeca).toHaveBeenCalledTimes(1);
    expect(mockExeca).toHaveBeenCalledWith("uv", ["--version"]);
    expect(logger.log).toHaveBeenCalledWith("uv is already installed");
  });

  it("should return success with installed=true if uv was installed", async () => {
    const mockExeca = execa as unknown as ReturnType<typeof vi.fn>;
    mockExeca
      .mockRejectedValueOnce(new Error("command not found: uv"))
      .mockResolvedValueOnce({ stdout: "" });

    const logger = { log: vi.fn() };
    const result = await ensureUv(logger);

    expect(result).toEqual({ success: true, installed: true });
    expect(mockExeca).toHaveBeenCalledTimes(2);
    expect(mockExeca).toHaveBeenNthCalledWith(1, "uv", ["--version"]);
    expect(mockExeca).toHaveBeenNthCalledWith(2, "sh", [
      "-c",
      "curl -LsSf https://astral.sh/uv/install.sh | sh",
    ]);
    expect(logger.log).toHaveBeenCalledWith("uv not found, installing...");
    expect(logger.log).toHaveBeenCalledWith("uv installed successfully");
  });

  it("should return failure with error if installation fails", async () => {
    const mockExeca = execa as unknown as ReturnType<typeof vi.fn>;
    mockExeca
      .mockRejectedValueOnce(new Error("command not found: uv"))
      .mockRejectedValueOnce(new Error("curl failed"));

    const logger = { log: vi.fn() };
    const result = await ensureUv(logger);

    expect(result).toEqual({
      success: false,
      installed: false,
      error: "curl failed",
    });
  });

  it("should work without logger", async () => {
    const mockExeca = execa as unknown as ReturnType<typeof vi.fn>;
    mockExeca.mockResolvedValueOnce({ stdout: "uv 0.1.0" });

    const result = await ensureUv();
    expect(result).toEqual({ success: true, installed: false });
  });
});

describe("normalizeVersion", () => {
  it("should normalize basic versions", () => {
    expect(normalizeVersion("1.0")).toBe("1.0");
    expect(normalizeVersion("1.0.0")).toBe("1.0.0");
    expect(normalizeVersion("1.2.3")).toBe("1.2.3");
  });

  it("should remove leading v", () => {
    expect(normalizeVersion("v1.0.0")).toBe("1.0.0");
    expect(normalizeVersion("V1.2.3")).toBe("1.2.3");
  });

  it("should normalize separators", () => {
    expect(normalizeVersion("1-0-0")).toBe("1.0.0");
    expect(normalizeVersion("1_0_0")).toBe("1.0.0");
  });

  it("should normalize pre-release versions", () => {
    expect(normalizeVersion("1.0.0a1")).toBe("1.0.0a1");
    expect(normalizeVersion("1.0.0alpha1")).toBe("1.0.0a1");
    expect(normalizeVersion("1.0.0b1")).toBe("1.0.0b1");
    expect(normalizeVersion("1.0.0beta1")).toBe("1.0.0b1");
    expect(normalizeVersion("1.0.0rc1")).toBe("1.0.0rc1");
    expect(normalizeVersion("1.0.0c1")).toBe("1.0.0rc1");
  });

  it("should normalize post-release versions", () => {
    expect(normalizeVersion("1.0.0.post1")).toBe("1.0.0.post1");
    expect(normalizeVersion("1.0.0.rev1")).toBe("1.0.0.post1");
    expect(normalizeVersion("1.0.0.r1")).toBe("1.0.0.post1");
  });

  it("should normalize dev versions", () => {
    expect(normalizeVersion("1.0.0.dev1")).toBe("1.0.0.dev1");
    expect(normalizeVersion("1.0.0dev1")).toBe("1.0.0.dev1");
  });

  it("should handle local versions", () => {
    expect(normalizeVersion("1.0.0+local")).toBe("1.0.0+local");
  });

  it("should trim whitespace", () => {
    expect(normalizeVersion("  1.0.0  ")).toBe("1.0.0");
  });

  it("should return original for invalid versions", () => {
    expect(normalizeVersion("not-a-version")).toBe("not-a-version");
  });
});

describe("spawn", () => {
  it("should call execa with the right arguments", async () => {
    const mockResult = { stdout: "result" };
    const mockExeca = execa as unknown as ReturnType<typeof vi.fn>;
    mockExeca.mockReturnValueOnce(Promise.resolve(mockResult));

    const result = spawn("python3", { env: { FOO: "bar" } }, ["--version"]);

    await expect(mockExeca).toHaveBeenCalledWith(
      "python3",
      ["--version"],
      expect.objectContaining({
        env: { FOO: "bar" },
      })
    );
    await expect(result).resolves.toEqual(mockResult);
  });
});
