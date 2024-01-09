import type { DiscoverFilter } from "./mod.ts";
import { FetchBackend } from "./mod.ts";
import type { JSONObject } from "/repository/mod.ts";
import type { InvestorId } from "./mod.ts";

export type Assets = Record<string, JSONObject>;

/** Test class to fetch from variables instead of website */
export class FetchHeapBackend implements FetchBackend {
  constructor(private readonly assets: Assets) {}

  public discover(_filter: DiscoverFilter): Promise<JSONObject> {
    return Promise.resolve(this.assets.discover);
  }

  public chart(_investor: InvestorId): Promise<JSONObject> {
    return Promise.resolve(this.assets.chart);
  }

  public portfolio(_investor: InvestorId): Promise<JSONObject> {
    return Promise.resolve(this.assets.portfolio);
  }

  public stats(_investor: InvestorId): Promise<JSONObject> {
    return Promise.resolve(this.assets.stats);
  }
}
