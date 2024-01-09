import { DateFormat } from "/utils/time/mod.ts";
import { JSONObject } from "../mod.ts";
import { Asset } from "../asset.ts";

export abstract class RepoBackend {
  /** Delete whole repo */
  abstract delete(): Promise<void>;

  /** Verify if asset exists */
  abstract has(assetname: string): Promise<boolean>;

  /** Store Asset */
  abstract store(assetname: string, data: JSONObject): Promise<void>;

  /** Retrieve asset and specific date, or latest available */
  abstract retrieve(
    assetname: string,
    date?: DateFormat
  ): Promise<JSONObject | null>;

  /** Age of latest storage of asset */
  abstract age(assetname: string): Promise<number | null>;

  /** Last date any asset is stored in repository */
  abstract end(): Promise<DateFormat | null>;

  /** All dates in repository */
  abstract dates(): Promise<DateFormat[]>;

  /** On which specific dates is named asset stored */
  abstract datesByAsset(assetname: string): Promise<DateFormat[]>;

  /** Which assets are available on specific date */
  abstract assetsByDate(date: DateFormat): Promise<string[]>;

  /** Date Series for named asset */
  public asset<JSONObject>(assetname: string): Asset<JSONObject> {
    return new Asset(this, assetname);
  }
}
