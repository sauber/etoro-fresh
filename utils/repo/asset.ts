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
  abstract filename: string;

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
  write(content: AssetType): Promise<void> {
    return this.repo.write(this.filename, JSON.stringify(content));
  }
}