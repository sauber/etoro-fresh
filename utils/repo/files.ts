import { join } from "path";

/** Wrapper for stat system call */
function stat(path: string) {
  return Deno.stat(path);
}

/** Wrapper for reading file */
function read(path: string) {
  return Deno.readTextFile(path);
}

/** Wrapper for writing file */
function write(path: string, content: string) {
  return Deno.writeTextFile(path, content);
}

/** Wrapper for creating directory */
async function mkdir(path: string) {
  try {
    await Deno.stat(path);
  } catch {
    await Deno.mkdir(path, { recursive: true });
  }

}

/** Get list of sub-directories */
async function dirs(path: string) {
  const dirNames: string[] = [];

  for await (const dirEntry of Deno.readDir(path)) {
    if (dirEntry.isDirectory) {
      dirNames.push(dirEntry.name);
    }
  }

  return dirNames.sort();
}

/** Direct file access */
export default class Files {
  constructor(private readonly path: string) {}

  /** Subdirectory */
  public sub(path: string): Files {
    return new Files(join(this.path, path));
  }

  /** Create directory */
  private async create(): Promise<void> {
    await mkdir(this.path);
  }

  /** Path to most recent file */
  public async latest(filename: string): Promise<string|undefined> {
    for ( const dir of await dirs(this.path) ) {
      const path = join(this.path, dir, filename);
      if ( await stat(path) ) {
        return path;
      }
    }
  }

  /** Write content to file */
  public async write(filename: string, content: string): Promise<void> {
    await this.create();
    write(join(this.path, filename), content);
  }

  /** Read content of file */
  public read(filename: string): Promise<string> {
    return read(join(this.path, filename));
  }
}