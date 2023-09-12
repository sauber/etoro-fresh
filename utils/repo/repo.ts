import { today } from "../calendar.ts";
import { Files } from "./files.ts";
import { Config } from "./config.ts";
import { UUID } from "./uuid.ts";
import { Discover } from "./discover.ts";

export class Repo {
  readonly files: Files;

  constructor(private readonly path: string) {
    this.files = new Files(path);
  }

  /** Create repo in tmp directory */
  static async tmp(): Promise<Repo> {
    const files: Files = await Files.tmp();
    return new Repo(files.path);
  }

  /** Delete repository */
  delete(): Promise<void> {
    return this.files.delete();
  }

  /** Write in path of today */
  async write(filename: string, content: string): Promise<void> {
    const fs: Files = this.files.sub(today());
    return await fs.write(filename, content);
  }

  get config(): Config {
    return new Config(this);
  }

  /** Session ID */
  get uuid(): UUID {
    return new UUID(this);
  }

  get discover(): Discover {
    return new Discover(this);
  }
}