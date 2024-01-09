import type { InvestorId } from "/investor/mod.ts";
import type { JSONObject } from "/repository/mod.ts";
//export { Refresh } from "./refresh.ts";

export interface FetchBackend {
  /** Search for investors matching criteria */
  discover(filter: DiscoverFilter): Promise<JSONObject>;

  /** Fetch a chart object for investor  */
  chart(investor: InvestorId): Promise<JSONObject>;

  /** Fetch list of investments for investor  */
  portfolio(investor: InvestorId): Promise<JSONObject>;

  /** Fetch stats of investor  */
  stats(investor: InvestorId): Promise<JSONObject>;
}

export type DiscoverFilter = {
  risk: number;
  daily: number;
  weekly: number;
};
