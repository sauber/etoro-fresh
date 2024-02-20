/** Confirm if a file exists */
export async function exists(filename: string): Promise<boolean> {
  //throw new Error('Files::exists() should never be called');
  try {
    await Deno.stat(filename);
    // successful, file or directory must exist
    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      // file or directory does not exist
      return false;
    } else {
      // unexpected error, maybe permissions, pass it along
      throw error;
    }
  }
}

/** Read a file */
export function read(path: string): Promise<string> {
  return Deno.readTextFile(path);
}

/** Write content to file file */
export function write(path: string, content: string): Promise<void> {
  return Deno.writeTextFile(path, content);
}

/** Wrapper for creating directory */
export async function mkdir(path: string): Promise<void> {
  try {
    await Deno.stat(path);
  } catch {
    await Deno.mkdir(path, { recursive: true });
    await Deno.stat(path);
  }
}

/** Get list of sub-directories, sorted */
export async function dirs(path: string): Promise<string[]> {
  const dirNames: string[] = [];

  for await (const dirEntry of Deno.readDir(path)) {
    if (dirEntry.isDirectory) dirNames.push(dirEntry.name);
  }

  return dirNames.sort();
}

/** Get list of files, sorted */
export async function files(path: string): Promise<string[]> {
  const fileNames: string[] = [];

  for await (const fileEntry of Deno.readDir(path)) {
    if (fileEntry.isFile) fileNames.push(fileEntry.name);
  }
  return fileNames.sort();
}

/** Create a temporary directory */
export async function mktmpdir(): Promise<string> {
  await mkdir("tmp");
  return Deno.makeTempDir({ dir: "tmp" });
}

/** Recursively remove directory */
export function rmdir(path: string): Promise<void> {
  return Deno.remove(path, { recursive: true });
}

/** Age of most recent file in milliseconds */
export async function age(path: string): Promise<number> {
  const file = await Deno.stat(path);
  const mtime: Date | null = file.mtime;
  if (!mtime) throw new Error(`Stat for ${path} has no mtime`);
  const now = new Date().getTime();
  return now - mtime.getTime();
}

export async function remove(path: string): Promise<void> {
  return Deno.remove(path);
}

