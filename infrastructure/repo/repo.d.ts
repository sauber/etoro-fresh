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

export type Asset = "config" | "discover";

export interface Repo {
  store(asset: Asset, data: JSONObject): Promise<void>;
  last(asset: Asset): Promise<JSONObject | null>;
  //read(asset: string): Promise<JSONObject|null>;
  //age(asset: string): Promise<void>;
  delete(): Promise<void>;
}
