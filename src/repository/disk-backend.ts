import type { JSONObject, AssetName, AssetNames } from "../repository/mod.ts";
import { Backend } from "../repository/mod.ts";
import { exists, read, write, files, dirs } from "../repository/files.ts";
import { join } from "path";

/** Store investor objects on disk */
export class DiskBackend implements Backend {
  constructor(private readonly _path: string) {}

  protected path(): Promise<string> {
    return Promise.resolve(this._path);
  }

  /** Convert assetname to filename */
  protected async filename(assetname: string): Promise<string> {
    return join(await this.path(), assetname + ".json");
  }

  /** Convert filename to assetname */
  protected assetname(filename: string): string {
    const [assetname, _ext] = filename.split(".");
    return assetname;
  }

  public async sub(partition: string): Promise<DiskBackend> {
    return new DiskBackend(join(await this.path(), partition));
  }

  public async dirs(): Promise<string[]> {
    return dirs(await this.path());
  }

  public async store(assetname: AssetName, data: JSONObject): Promise<void> {
    return write(await this.filename(assetname), JSON.stringify(data));
  }

  public async retrieve(assetname: AssetName): Promise<JSONObject> {
    const filename: string = await this.filename(assetname);
    const content: string = await read(filename);
    const data: JSONObject = JSON.parse(content);
    return data;
  }

  public async has(assetname: AssetName): Promise<boolean> {
    const result: boolean = await exists(await this.filename(assetname))
    //console.log('Backend', await this.path(), 'has', assetname, ':', result);
    //return exists(await this.filename(assetname));
    return result;
  }

  public async names(): Promise<AssetNames> {
    if (!(await exists(await this.path()))) return [];

    const filenames: string[] = await files(await this.path());
    const assetnames: string[] = filenames.map((FileName: string) =>
      this.assetname(FileName)
    );
    return assetnames;
  }
}
