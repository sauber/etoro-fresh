import { join } from "path";
import { exists } from "fs";

/** Wrapper for stat system call */
function stat(path: string) {
  return Deno.stat(path);
}

/** Wrapper for reading file */
function read(path: string): Promise<string> {
  return Deno.readTextFile(path);
}

/** Wrapper for writing file */
function write(path: string, content: string): Promise<void> {
  return Deno.writeTextFile(path, content);
}

/** Wrapper for creating directory */
async function mkdir(path: string): Promise<void> {
  try {
    await Deno.stat(path);
  } catch {
    await Deno.mkdir(path, { recursive: true });
    await Deno.stat(path);
  }
}

/** Get list of sub-directories, sorted */
async function dirs(path: string): Promise<string[]> {
  const dirNames: string[] = [];

  for await (const dirEntry of Deno.readDir(path))
    if (dirEntry.isDirectory) dirNames.push(dirEntry.name);

  return dirNames.sort();
}

/** Get list of files, sorted */
async function files(path: string): Promise<string[]> {
  const fileNames: string[] = [];

  for await (const fileEntry of Deno.readDir(path)) {
    if (fileEntry.isFile) fileNames.push(fileEntry.name);
  }
  return fileNames.sort();
}

/** Create a temporary directory */
function mktmpdir(): Promise<string> {
  return Deno.makeTempDir();
}

/** Recursively remove directory */
function rmdir(path: string): Promise<void> {
  return Deno.remove(path, { recursive: true });
}

/** Direct file access */
export class Files {
  constructor(readonly path: string) {}

  /** Subdirectory */
  private readonly _sub: Record<string, Files> = {};
  public sub(path: string): Files {
    if ( ! ( path in this._sub )) {
      this._sub[path] = new Files(join(this.path, path));
    }
    return this._sub[path];
  }

  /** Create directory */
  public create(): Promise<void> {
    return mkdir(this.path);
  }

  /** Delete directory */
  public delete(): Promise<void> {
    return rmdir(this.path);
  }

  /** List of all subdirectories */
  private _dirs: null|string[] = null;
  public async dirs(): Promise<string[]> {
    if ( ! this._dirs ) this._dirs = await dirs(this.path);
    return this._dirs;
  }

  /** List of all subdirectories */
  private _files: null|string[] = null;
  public async files(): Promise<string[]> {
    if ( ! this._files ) this._files = await files(this.path);
    return this._files;
  }

  /** Name of most recent directory */
  public async last(): Promise<string> {
    const dirnames = await this.dirs();
    return dirnames[dirnames.length - 1];
  }

  /** Subdirectory of most recent file */
  public async latest(filename: string): Promise<string | undefined> {
    const list: string[] = await this.dirs();
    for (const dir of list.reverse()) {
      const path = join(this.path, dir, filename);
      if (await exists(path)) return dir;
    }
  }

  /** Write content to file */
  public async write(filename: string, content: string): Promise<void> {
    await this.create();
    return write(join(this.path, filename), content);
  }

  /** Read content of file */
  public read(filename: string): Promise<string> {
    return read(join(this.path, filename));
  }

  /** Create class setting path to temporary directory */
  public static async tmp(): Promise<Files> {
    const path: string = await mktmpdir();
    return new Files(path);
  }

  /** Age of most recent file in milliseconds */
  public async age(filename: string): Promise<number | null> {
    const subdir = await this.latest(filename);
    if (!subdir) return null;

    const fullPath = join(this.path, subdir, filename);
    const file = await stat(fullPath);
    const mtime: Date | null = file.mtime;
    if (!mtime) throw new Error(`Cannot get mtime for ${fullPath}`);
    return (new Date()).getTime() - mtime.getTime();
  }
}
