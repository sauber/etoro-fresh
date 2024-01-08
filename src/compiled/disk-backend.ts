import { Backend, InvestorObject } from "./backend.ts";
import { TextSeries } from "📚/utils/series.ts";
import { Files } from "📚/repository/files.ts";

/** Convert UserName to filename */
const filename = function (UserName: string): string {
  return UserName + ".json";
};

/** Convert filename to username */
const username = function (filename: string): string {
  const [UserName, _ext] = filename.split(".");
  return UserName;
};

/** Store investor objects on disk */
export class DiskBackend implements Backend {
  protected _files: Files | null = null;

  constructor(private readonly path: string) {}

  /** File object at repository root */
  protected files(): Promise<Files> {
    if (!this._files) this._files = new Files(this.path);
    return Promise.resolve(this._files);
  }

  public delete(): Promise<void> {
    throw new Error("Refuse to delete persistent disk repository");
  }

  public async has(UserName: string): Promise<boolean> {
    const fs: Files = await this.files();
    return fs.exists(filename(UserName));
  }

  public async store(data: InvestorObject): Promise<void> {
    const fs: Files = await this.files();
    const string: string = JSON.stringify(data)
    return fs.write(filename(data.UserName), string);
  }

  public async retrieve(UserName: string): Promise<InvestorObject> {
    const fs: Files = await this.files();
    const string = await fs.read(filename(UserName));
    return JSON.parse(string);
  }

  public async names(): Promise<TextSeries> {
    const fs: Files = await this.files();
    const filenames: string[] = await fs.files();
    const UserNames: string[] = filenames.map((FileName: string) =>
      username(FileName)
    );
    return new TextSeries(UserNames);
  }
}
