import { Repo } from "./repo.ts";
import { Files } from "./files.ts";

export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

export interface JSONObject {
  [k: string]: JSONValue;
}

/** Abstract Asset class */
export abstract class Asset<AssetType> {
  protected abstract filename: string;

  /** Refresh file if expired */
  abstract recent(): Promise<AssetType>;

  constructor(protected readonly repo: Repo) {}

  /** Generic method to search for and load content of most recent file */
  async latest(): Promise<AssetType> {
    const fs: Files = this.repo.files;
    const latestPath: string | undefined = await fs.latest(this.filename);
    if (!latestPath) throw new Error(`File ${this.filename} not found`);
    const content: string = await fs.sub(latestPath).read(this.filename);
    const data = JSON.parse(content) as AssetType;
    return data;
  }

  /** Write content to todays directory */
  protected write(content: AssetType): Promise<void> {
    return this.repo.write(this.filename, JSON.stringify(content));
  }
}

export abstract class Downloadable<AssetType> extends Asset<AssetType> {
  protected abstract expire: number;
  protected abstract url(): Promise<string>;
  protected abstract validate(data: AssetType): boolean;

  protected uuid(): Promise<string> {
    return this.repo.uuid.recent();
  }

  protected async download(): Promise<AssetType> {
    const fs: Files = this.repo.files;
    const url = await this.url();
    const content: string = await fs.download(url);
    const data = JSON.parse(content) as AssetType;
    this.validate(data);
    return data;
  }

  async recent(): Promise<AssetType> {
    const files = this.repo.files;
    const age = await files.age(this.filename);
    if (!age || age > this.expire) {
      const data: AssetType = await this.download();
      await files.write(this.filename, JSON.stringify(data));
      return data;
    } else {
      const data = await this.latest();
      if (data) return data as AssetType;
    }
    throw new Error("File not downloaded");
  }
}