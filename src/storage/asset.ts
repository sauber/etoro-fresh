import type { DateFormat } from "/utils/time/mod.ts";
import { today } from "📚/utils/time/mod.ts";
import type { AssetName, JSONObject } from "./mod.ts";
import { Backend } from "./backend.ts";

type Dates = Set<DateFormat>;

/** A named asset in repo on all the dates it is available */
export class Asset<AssetType> {
  constructor(
    private readonly assetname: AssetName,
    private readonly repo: Backend
  ) {}

  /** On which dates is asset available */
  private _dates: Dates | null = null;
  public async dates(): Promise<Dates> {
    if (this._dates === null) {
      const allDates: DateFormat[] = await this.repo.dirs();
      const hasAsset: boolean[] = await Promise.all(
        allDates.map((date) =>
          this.repo.sub(date).then((sub) => sub.has(this.assetname))
        )
      );
      const presentDates: DateFormat[] = allDates.filter((_date, index) => hasAsset[index]);
      this._dates = new Set<DateFormat>(presentDates);
    }
    return this._dates;
  }

  /** At least one date must exist */
  // TODO: This is too similar to this.exists()
  private async validatedDates(): Promise<Dates> {
    const dates: Dates = await this.dates();
    //console.log("Dates for", this.assetname, dates);
    if (dates.size < 1)
      throw new Error(`Asset ${this.assetname} is unavailable`);
    return dates;
  }

  /** Verify if least one date exists */
  public async exists(): Promise<boolean> {
    if ((await this.dates()).size > 0) return true;
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
    const dates = await this.dates();
    dates.add(date);

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
    const dates: Dates = await this.validatedDates();
    const [first] = dates;
    return first;
  }

  /** Last date */
  public async end(): Promise<DateFormat> {
    const dates: Dates = await this.validatedDates();
    const array = Array.from(dates);
    return array[array.length-1];
  }

  /** Data on first date */
  public async first(): Promise<AssetType> {
    return this.retrieve(await this.start());
  }

  /** Data on last date */
  public async last(): Promise<AssetType> {
    return this.retrieve(await this.end());
  }

  /** Delete asset on date */
  private async trim(date: DateFormat): Promise<void> {
    const sub: Backend = await this.repo.sub(date);
    await sub.delete(this.assetname);
    const dates: Dates = await this.dates();
    dates.delete(date);
   }

  /** Delete all occurences */
  public async erase(): Promise<void> {
    const dates: Dates = await this.dates();

    await Promise.all([...dates].map( (date: DateFormat) => this.trim(date)));
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
