import type { DateFormat } from "/utils/time/mod.ts";
import { today } from "📚/utils/time/mod.ts";
import type { AssetName, JSONObject } from "./mod.ts";
import { Backend } from "./backend.ts";

/** A named asset in repo on all the dates it is available */
export class Asset<AssetType> {
  constructor(
    private readonly assetname: AssetName,
    private readonly repo: Backend
  ) {}

  /** On which dates is asset available */
  private _dates: DateFormat[] | null = null;
  public async dates(): Promise<DateFormat[]> {
    if (this._dates === null) {
      const allDates: DateFormat[] = await this.repo.dirs();
      const hasAsset: boolean[] = await Promise.all(
        allDates.map((date) =>
          this.repo.sub(date).then((sub) => sub.has(this.assetname))
        )
      );
      const presentDates = allDates.filter((_date, index) => hasAsset[index]);
      this._dates = presentDates;
    }
    return this._dates;
  }

  /** At least one date must exist */
  private async validatedDates(): Promise<DateFormat[]> {
    const dates = await this.dates();
    //console.log("Dates for", this.assetname, dates);
    if (dates.length < 1)
      throw new Error(`Asset ${this.assetname} is unavailable`);
    return dates;
  }

  /** Verify if least one date exists */
  public async exists(): Promise<boolean> {
    if ((await this.dates()).length > 0) return true;
    else return false;
  }

  /** Age of most recent asset */
  public async age(): Promise<number> {
    const end: DateFormat = await this.end();
    const sub: Backend = await this.repo.sub(end);
    return sub.age(this.assetname);
  }

  /** Store data at date, default today */
  public async store(content: AssetType, date: DateFormat = today()): Promise<void> {
    // Append date to cached dates
    const dates = new Set<DateFormat>(await this.dates());
    dates.add(date);
    this._dates = Array.from(dates);

    // Store data
    const sub: Backend = await this.repo.sub(date);
    return sub.store(this.assetname, content as JSONObject);
  }

  /** Load data on specific date */
  public async retrieve(date: DateFormat): Promise<AssetType> {
    const sub: Backend = await this.repo.sub(date);
    return (await sub.retrieve(this.assetname)) as AssetType;
  }

  /** First date */
  public async start(): Promise<DateFormat> {
    const dates: DateFormat[] = await this.validatedDates();
    return dates[0];
  }

  /** Last date */
  public async end(): Promise<DateFormat> {
    const dates: DateFormat[] = await this.validatedDates();
    return dates.reverse()[0];
  }

  /** Data on first date */
  public async first(): Promise<AssetType> {
    return this.retrieve(await this.start());
  }

  /** Data on last date */
  public async last(): Promise<AssetType> {
    return this.retrieve(await this.end());
  }

  /** Delete all occurences */
  public await erase(): Promise<void> {
    const dates: DateFormat[] = await this.dates();

    dates.forEach(date => {
      const sub: Backend = await this.repo.sub(date);
      return sub.delete(this.assetname);
    })

    this._dates = [];
  }

  /** Search for asset no later than date */
  // public async before(date: DateFormat): Promise<AssetType> {
  //   // Available dates
  //   const dates: DateFormat[] = await this.validatedDates();
  //   const start: DateFormat = dates[0];
  //   const end: DateFormat = dates[dates.length - 1];

  //   // Outside range
  //   if (date >= end) return this.retrieve(end);
  //   if (date < start) {
  //     throw new Error(
  //       `´Searching for asset before ${date} but first date is ${start}`
  //     );
  //   }

  //   // In range
  //   for (const available of [...dates].reverse()) {
  //     if (available <= date) return this.retrieve(available);
  //   }

  //   console.log(this.assetname, { dates, start, end, date });
  //   throw new Error("This code should never be reached");
  // }

  // /** Search for asset no sooner than date */
  // public async after(date: DateFormat): Promise<AssetType> {
  //   // Available dates
  //   const dates: DateFormat[] = await this.validatedDates();
  //   const start: DateFormat = dates[0];
  //   const end: DateFormat = dates[dates.length - 1];

  //   // Outside range
  //   if (date > end) {
  //     throw new Error(
  //       `´Searching for ${this.assetname} after ${date} but latest date is ${end}`
  //     );
  //   }
  //   if (date <= start) return this.retrieve(start);

  //   // In range
  //   for (const available of dates) {
  //     if (available >= date) return this.retrieve(available);
  //   }

  //   throw new Error("This code should never be reached");
  // }
}
