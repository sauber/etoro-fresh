import { JSONObject, Config, RepoDiskBackend } from "/repository/mod.ts";
import type { DiscoverParams } from "/discover/discover.d.ts";
import type { InvestorId } from "/investor/mod.ts";
import type { Assets } from "./fetch-heap.ts";

export const repoPath = "src/repository/testdata"
export const repoBackend = new RepoDiskBackend(repoPath);
export const config = new Config(repoBackend);

export const investorId: InvestorId = {
  UserName: (await config.get("UserName")) as string,
  CustomerId: (await config.get("CustomerId")) as number,
};

export const discoverOptions: DiscoverParams = {
  risk: (await config.get("discover_risk")) as number,
  daily: (await config.get("discover_daily")) as number,
  weekly: (await config.get("discover_weekly")) as number,
};

// Pull from repo a collective of assets
export const testAssets: Assets = {
  // discover
  "rankings/rankings": (await repoBackend.retrieve("discover")) as JSONObject,

  // chart
  "CopySim": (await repoBackend.retrieve(
    investorId.UserName + ".chart"
  )) as JSONObject,

  // portfolio
  portfolio: (await repoBackend.retrieve(
    investorId.UserName + ".portfolio"
  )) as JSONObject,

  // stats
  "rankings/cid": (await repoBackend.retrieve(
    investorId.UserName + ".stats"
  )) as JSONObject,
};
