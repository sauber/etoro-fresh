import { today } from "../time/calendar.ts";
import { JSONObject, RepoBackend } from "./repo.d.ts";
import { Files } from "./files.ts";
import { DateFormat } from "/infrastructure/time/calendar.ts";

function filename(asset: string): string {
  return asset + ".json";
}

/** Disk base storage for repository */
export class RepoDiskBackend implements RepoBackend {
  constructor(private readonly path: string) {}

  /** File object at repository root */
  protected files(): Promise<Files> {
    return new Promise((resolve) => resolve(new Files(this.path)));
  }

  /** Not allow for persistent repository */
  public delete(): Promise<void> {
    throw new Error("Refuse to delete persistent disk repository");
  }

  public async store(assetname: string, data: JSONObject): Promise<void> {
    const fs = await this.files();
    const dir = today();
    const content = JSON.stringify(data);
    const file = filename(assetname);
    return fs.sub(dir).write(file, content);
  }

  async dates(): Promise<DateFormat[]> {
    const fs = await this.files();
    return fs.dirs();
  }

  public async assetsByDate(date: DateFormat): Promise<string[]> {
    const fs = (await this.files()).sub(date);
    return (await fs.files())
      .filter((filename: string) => filename.match(/\.json$/))
      .map((filename: string) => filename.replace(/\.json/, ""));
  }

  public async datesByAsset(assetname: string): Promise<DateFormat[]> {
    const allDates = await this.dates();
    const dates: DateFormat[] = [];
    for (const date of allDates) {
      const assets = await this.assetsByDate(date);
      if (assets.includes(assetname)) dates.push(date);
    }
    return dates;
  }

  /** Which date is most recent for asset */
  private async end(assetname: string): Promise<DateFormat|undefined> {
    return (await this.files()).latest(filename(assetname));
  }
  
  public async retrieve(
    assetname: string,
    date?: DateFormat
  ): Promise<JSONObject | null> {
    if (!date) date = await this.end(assetname);
    if (!date) return null;
    const fs = (await this.files()).sub(date);
    const content = await fs.read(filename(assetname));
    const data = JSON.parse(content);
    return data;
  }

  public async age(assetname: string): Promise<number|null> {
    return (await this.files()).age(filename(assetname));
  }
}
