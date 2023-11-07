import { today, DateFormat } from "/utils/time/mod.ts";
import { JSONObject } from "./mod.ts";
import { RepoBackend } from "./repo-backend.ts";
import { Files } from "./files.ts";

function filename(asset: string): string {
  return asset + ".json";
}

/** Disk base storage for repository */
export class RepoDiskBackend extends RepoBackend {
  constructor(private readonly path: string) {super()}

  /** File object at repository root */
  private _files: Files | null = null;
  protected files(): Promise<Files> {
    if ( ! this._files) this._files = new Files(this.path);
    //return new Promise((resolve) => resolve(new Files(this.path)));
    return Promise.resolve(this._files);
  }

  /** Not allow for persistent repository */
  public delete(): Promise<void> {
    throw new Error("Refuse to delete persistent disk repository");
  }

  public async store(assetname: string, data: JSONObject): Promise<void> {
    const fs: Files = await this.files();
    const dir: DateFormat = today();
    const content: string = JSON.stringify(data);
    const file: string = filename(assetname);
    return fs.sub(dir).write(file, content);
  }

  public async dates(): Promise<DateFormat[]> {
    const fs: Files = await this.files();
    return fs.dirs();
  }

  public async end(): Promise<DateFormat|null> {
    const dates = await this.dates();
    if ( dates.length > 0) return dates.reverse()[0]
    else return null;
  }

  private _assets: Record<DateFormat, string[]> = {}
  public async assetsByDate(date: DateFormat): Promise<string[]> {
    if ( ! ( date in this._assets )) {
    const fs: Files = (await this.files()).sub(date);
    const filenames: string[] = await fs.files();
    const assetnames: string[] = filenames
      .filter((filename: string) => filename.endsWith(".json"))
      .map((filename: string) => filename.slice(0, filename.length-5));
    this._assets[date] = assetnames;
  }
  return this._assets[date];
}

  public async datesByAsset(assetname: string): Promise<DateFormat[]> {
    const allDates: DateFormat[] = await this.dates();
    const dates: DateFormat[] = [];
    for (const date of allDates) {
      const assets: string[] = await this.assetsByDate(date);
      if (assets.includes(assetname)) dates.push(date);
    }
    return dates;
  }

  /** Which date is most recent for asset */
  private async assetEnd(assetname: string): Promise<DateFormat|undefined> {
    return (await this.files()).latest(filename(assetname));
  }
  
  public async retrieve(
    assetname: string,
    date?: DateFormat
  ): Promise<JSONObject | null> {
    if (!date) date = await this.assetEnd(assetname);
    if (!date) return null;
    const fs: Files = (await this.files()).sub(date);
    const content: string = await fs.read(filename(assetname));
    const data: JSONObject = JSON.parse(content);
    return data;
  }

  public async age(assetname: string): Promise<number|null> {
    return (await this.files()).age(filename(assetname));
  }
}
