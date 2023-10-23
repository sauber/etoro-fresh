import { Config, JSONObject } from "/repository/mod.ts";
export { Refresh } from "./refresh.ts";

export interface FetchBackend {
  get(url: string): Promise<JSONObject>;
  config: Config;
};
