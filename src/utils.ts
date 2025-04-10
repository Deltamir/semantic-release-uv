import { execa, Options, ResultPromise } from 'execa';
async function normalizeVersion(
    version: string,
    options: Options = {},
  ): Promise<string> {
    const { stdout } = await spawn(
      'python3',
      [
        '-c',
        `from packaging.version import Version\nprint(Version('${version}'))`,
      ],
      options,
    );
    return stdout as unknown as string;
  }

function spawn(
    file: string | URL,
    args?: readonly string[],
    options?: Options,
  ): ResultPromise {
    const cp = execa(file, args, {
      ...options,
      stdout: undefined,
      stderr: undefined,
    });
  
    if (options?.stdout) {
      (cp.stdout as any)?.pipe(options.stdout, { end: false });
    }
    if (options?.stderr) {
      (cp.stderr as any)?.pipe(options.stderr, { end: false });
    }
  
    return cp;
  }
  
  export { normalizeVersion, spawn };