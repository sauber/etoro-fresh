import { today } from "../time/calendar.ts";
import { Repo, Asset, JSONObject } from "./repo.d.ts";
import { Files } from "./files.ts";

function filename(asset: Asset): string {
  return asset + ".json";
}

/** Disk base storage for repository */
export class DiskRepo implements Repo {
  constructor(private readonly path: string) {}

  /** Not allow for persistent repository */
  public delete(): Promise<void> {
    throw new Error("Refuse to delete persistent disk repository");
  }

  /** File object at respository root */
  protected files(): Promise<Files> {
    return new Promise((resolve) => resolve(new Files(this.path)));
  }

  /** Write content to file in directory */
  private async write(
    dir: string,
    filename: string,
    data: JSONObject
  ): Promise<void> {
    const fs: Files = (await this.files()).sub(dir);
    const content = JSON.stringify(data);
    return fs.write(filename, content);
  }

  /** Read and parse content of file in dir */
  private async read(dir: string, filename: string): Promise<JSONObject> {
    const fs: Files = (await this.files()).sub(dir);
    const content: string = await fs.read(filename);
    const data: JSONObject = JSON.parse(content);
    return data;
  }

  /** Write content to todays directory */
  public store(asset: Asset, data: JSONObject): Promise<void> {
    return this.write(today(), filename(asset), data);
  }

  public async age(asset: Asset): Promise<JSONObject | null> {


  public async last(asset: Asset): Promise<JSONObject | null> {
    const fs: Files = await this.files();
    const file: string = filename(asset);
    const dir: string | undefined = await fs.latest(file);
    if (dir) return this.read(dir, file);
    else return null;
  }
}
