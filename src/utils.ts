import { execa, Options, ResultPromise } from "execa";
async function normalizeVersion(
  version: string,
  options: Options = {},
): Promise<string> {
  const { stdout } = await spawn("python3", options, [
    "-c",
    `from packaging.version import Version\nprint(Version('${version}'))`,
  ]);
  return stdout as unknown as string;
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
