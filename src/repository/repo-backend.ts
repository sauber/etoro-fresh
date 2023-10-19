import { DateFormat } from "/utils/time/calendar.ts";
import { LazyLoad } from "./lazy-load.ts";
import { JSONObject } from "./mod.ts";
import { DateSeries } from "./date-series.ts";

export abstract class RepoBackend {
  /** Delete whole repo */
  abstract delete(): Promise<void>;

  /** Store Asset */
  abstract store(assetname: string, data: JSONObject): Promise<void>;

  /** Retrieve asset and specific date, or latest available */
  abstract retrieve(assetname: string, date?: DateFormat): Promise<JSONObject | null>;

  /** Age of latest storage of asset */
  abstract age(assetname: string): Promise<number | null>;

  /** Last date any asset is stored in repository */
  abstract end(): Promise<DateFormat|null>;

  /** All dates in repository */
  abstract dates(): Promise<DateFormat[]>;

  /** On which specific dates is named asset stored */
  abstract datesByAsset(assetname: string): Promise<DateFormat[]>;

  /** Which assets are available on specific date */
  abstract assetsByDate(date: DateFormat): Promise<string[]>;

  /** Load data not until needed */
  public lazyload(assetname: string, date?: DateFormat): LazyLoad {
    return new LazyLoad(() => this.retrieve(assetname, date));  
  }

  /** Date Series for named asset */
  public asset(assetname: string): DateSeries {
    return new DateSeries(this, assetname);
  }
}
