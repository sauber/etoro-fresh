import { JSONObject } from "./repo.d.ts";
import type { DateFormat } from "../time/calendar.ts";

/** Abstract class definition for a Repo backend class */
export abstract class RepoAbstractBackend {
  /** Delete whole repo */
  public abstract delete(): Promise<void>;

  /** Store/Retrieve Objects */
  public abstract store(assetname: string, data: JSONObject): Promise<void>;
  public abstract retrieve(assetname: string, date?: DateFormat): Promise<JSONObject>;

  /** Inventory */
  public abstract dates(): Promise<DateFormat[]>;
  public abstract datesByAsset(assetname: string): Promise<DateFormat[]>;
  public abstract assetsByDate(date: DateFormat): Promise<string[]>;
}
