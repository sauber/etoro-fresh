import { JSONObject } from "/repository/mod.ts";
export { Refresh } from "./refresh.ts";

export interface FetchBackend {
  get(url: string): Promise<JSONObject>
};

export type DiscoverParams = {
    risk: number,
    daily: number,
    weekly: number,
}