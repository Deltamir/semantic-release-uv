import { describe, it, expect, vi, beforeEach } from "vitest";
import { normalizeVersion, spawn } from "../src/utils";
import { execa } from "execa";

vi.mock("execa");

describe("normalizeVersion", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should normalize a version using packaging.version.Version", async () => {
    const mockStdout = "1.0.0";
    (execa as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce(
      Promise.resolve({ stdout: mockStdout })
    );

    const version = await normalizeVersion("1.0");
    await expect(version).toBe("1.0.0");

    await expect(execa).toHaveBeenCalledWith(
      "python3",
      [
        "-c",
        "from packaging.version import Version\nprint(Version('1.0'))",
      ],
      expect.any(Object)
    );
  });

  it("should throw an error if the python subprocess fails", async () => {
    (execa as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("Python error")
    );

    await expect(normalizeVersion("1.0")).rejects.toThrow("Python error");
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
