import type { DateFormat } from "/utils/time/calendar.ts";
export { Config } from "./config.ts";
export { Repo } from "./repo.ts";
export { RepoDiskBackend } from "./repo-disk.ts";

export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

export type JSONObject = {
  [key: string]: JSONValue;
};

export interface RepoBackend {
  /** Delete whole repo */
  delete(): Promise<void>;

  /** Store/Retrieve Assets */
  store(assetname: string, data: JSONObject): Promise<void>;
  retrieve(assetname: string, date?: DateFormat): Promise<JSONObject | null>;

  /** Asset Meta */
  age(assetname: string): Promise<number | null>;

  /** Asset Inventory */
  end(): Promise<DateFormat>;
  dates(): Promise<DateFormat[]>;
  datesByAsset(assetname: string): Promise<DateFormat[]>;
  assetsByDate(date: DateFormat): Promise<string[]>;
}
