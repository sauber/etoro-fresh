export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

export type JSONObject = {
  [k: string]: JSONValue;
};

export type Asset = "config" | "discover" | "chart" | "portfolio" | "stats";

export interface Repo {
  store(asset: Asset, data: JSONObject): Promise<void>;
  last(
    asset: Asset,
    options?: Record<string, string | number>
  ): Promise<JSONObject | null>;
  age(
    asset: Asset,
    options?: Record<string, string | number>
  ): Promise<number | null>;
  delete(): Promise<void>;
}
