import { execa, Options, ResultPromise } from "execa";

/**
 * Normalize a version string according to PEP 440.
 * This mimics Python's packaging.version.Version normalization.
 * @see https://peps.python.org/pep-0440/
 */
function normalizeVersion(version: string): string {
  // Trim whitespace and convert to lowercase
  let v = version.trim().toLowerCase();

  // Remove leading 'v' if present
  v = v.replace(/^v/, "");

  // Normalize separators: replace _ and - with .
  v = v.replace(/[-_]/g, ".");

  // PEP 440 regex pattern (simplified)
  const pep440Regex =
    /^(\d+!)?((\d+)(\.(\d+))*(\.(\d+))*)((a|alpha|b|beta|c|rc|pre|preview)(\d+)?)?((\.?(post|rev|r)(\d+)?))?((\.?dev(\d+)?))?(\+[a-z0-9]+(\.?[a-z0-9]+)*)?$/i;

  const match = v.match(pep440Regex);
  if (!match) {
    // Return as-is if it doesn't match PEP 440
    return version.trim();
  }

  // Extract components
  const epoch = match[1] ? match[1] : "";
  const release = match[2] || "0";

  // Normalize pre-release
  let pre = "";
  if (match[8]) {
    const preType = match[9]?.toLowerCase() || "";
    const preNum = match[10] || "0";
    const normalizedPreType =
      preType === "alpha"
        ? "a"
        : preType === "beta"
          ? "b"
          : preType === "c" ||
              preType === "rc" ||
              preType === "pre" ||
              preType === "preview"
            ? "rc"
            : preType;
    pre = normalizedPreType + preNum;
  }

  // Normalize post-release
  let post = "";
  if (match[12]) {
    const postNum = match[14] || "0";
    post = ".post" + postNum;
  }

  // Normalize dev release
  let dev = "";
  if (match[15]) {
    const devNum = match[17] || "0";
    dev = ".dev" + devNum;
  }

  // Local version (after +)
  const local = match[18] || "";

  return epoch + release + pre + post + dev + local;
}

function spawn(
  file: string | URL,
  options: Options,
  args?: readonly string[],
): ResultPromise {
  const cp = execa(file, args, {
    ...options,
    stdout: options.stdout ?? undefined,
    stderr: options.stderr ?? undefined,
  });

  return cp;
}

export { normalizeVersion, spawn };
