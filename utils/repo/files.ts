import { join } from "path";
import { difference } from "difference";

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
    // console.log(`Created directory ${path}`);
  }
}

/** Get list of sub-directories */
async function dirs(path: string): Promise<string[]> {
  // console.log(`Scanning for subdirs in ${path}`);
  const dirNames: string[] = [];

  for await (const dirEntry of Deno.readDir(path)) {
    // console.log('Direntry: ', dirEntry);
    if (dirEntry.isDirectory) {
      dirNames.push(dirEntry.name);
    }
  }

  return dirNames.sort();
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
export default class Files {
  constructor(readonly path: string) {}

  /** Subdirectory */
  public sub(path: string): Files {
    return new Files(join(this.path, path));
  }

  /** Create directory */
  private create(): Promise<void> {
    return mkdir(this.path);
  }

  /** Delete directory */
  public delete(): Promise<void> {
    return rmdir(this.path);
  }

  /** Path to most recent file */
  public async latest(filename: string): Promise<string | undefined> {
    const list: string[] = await dirs(this.path);
    for (const dir of list.reverse()) {
      const path = join(this.path, dir, filename);
      // console.log(`Testing latest path: ${path}`);
      if (await stat(path)) {
        return dir;
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

  /** Create class setting path to temporary directory */
  public static async tmp(): Promise<Files> {
    const path: string = await mktmpdir();
    //console.log('Creating temp dir: ', path);
    return new Files(path);
  }

  /** Create temporary file */
  private tmpfile(): Promise<string> {
    return mktmpdir();
  }

  /** Download content from url */
  public async download(url: string): Promise<string> {
    //console.log('download url: ', url);
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
      },
    });
    const content = await response.text();
    //console.log('result: ', content);

    return content;
  }

  /** Age of file in minutes */
  public async age(filename: string): Promise<number | null> {
    const fullPath = await this.latest(filename);
    if (!fullPath) return null;

    const file = await stat(fullPath);
    const mtime: Date | null = file.mtime;
    if (!mtime) throw new Error(`Cannot get mtime for ${fullPath}`);

    const diff = difference(mtime, new Date(), { units: ["minutes"] });
    if (diff.minutes != undefined) return diff.minutes;

    //console.log("diff: ", diff);
    throw new Error(`Age cannot be decided in minutes`);
  }
}
