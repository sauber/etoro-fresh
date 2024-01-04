import { DateFormat, DateSeriesAsync } from "/utils/time/mod.ts";
import { RepoBackend } from "./mod.ts";

/** A named asset in repo on all the dates it is available */
export class Asset<AssetType> implements DateSeriesAsync<AssetType> {
  constructor(
    private readonly repo: RepoBackend,
    private readonly assetname: string,
  ) {}

  private async load(date: DateFormat): Promise<AssetType> {
    return (await this.repo.retrieve(this.assetname, date)) as AssetType;
  }

  public dates(): Promise<DateFormat[]> {
    return this.repo.datesByAsset(this.assetname);
  }

  public async start(): Promise<DateFormat> {
    const dates: DateFormat[] = await this.dates();
    return dates[0];
  }

  public async end(): Promise<DateFormat> {
    const dates: DateFormat[] = await this.dates();
    return dates.reverse()[0];
  }

  public async first(): Promise<AssetType> {
    return this.load(await this.start());
  }

  public async last(): Promise<AssetType> {
    return this.load(await this.end());
  }

  /** Search for asset no later than date */
  public async before(date: DateFormat): Promise<DateFormat> {
    // Available dates
    const dates: DateFormat[] = await this.dates();
    const start: DateFormat = dates[0];
    const end: DateFormat = dates[dates.length - 1];

    // Outside range
    if (date >= end) return end;
    if (date < start) {
      throw new Error(
        `´Searching for asset before ${date} but first date is ${start}`,
      );
    }

    // In range
    for (const available of dates.reverse()) {
      if (available <= date) return available;
    }

    console.log(this.assetname, { dates, start, end, date });
    throw new Error("This code should never be reached");
  }

  /** Search for asset no sooner than date */
  public async after(date: DateFormat): Promise<DateFormat> {
    // Available dates
    const dates: DateFormat[] = await this.dates();
    const start: DateFormat = dates[0];
    const end: DateFormat = dates[dates.length - 1];

    // Outside range
    if (date > end) {
      throw new Error(
        `´Searching for ${this.assetname} after ${date} but latest date is ${end}`,
      );
    }
    if (date <= start) return start;

    // In range
    for (const available of dates) {
      if (available >= date) return available;
    }

    throw new Error("This code should never be reached");
  }

  public async value(date: DateFormat): Promise<AssetType> {
    const available: DateFormat = await this.before(date);
    return this.load(available);
  }
}
