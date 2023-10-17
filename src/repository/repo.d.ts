import type { DateFormat } from "/utils/time/calendar.ts";

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

export type DiscoverParams = {
  risk: number;
  daily: number;
  weekly: number;
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
  dates(): Promise<DateFormat[]>;
  datesByAsset(assetname: string): Promise<DateFormat[]>;
  assetsByDate(date: DateFormat): Promise<string[]>;
}

export interface FetchBackend {
  get(url: string): Promise<JSONObject>;
}
