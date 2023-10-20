import { config, repoBackend } from "/repository/testdata.ts";
import type { JSONObject } from "../repository/mod.ts";
import type { DiscoverParams } from "../discover/mod.ts";
import { Assets } from "./fetch-heap.ts";
import { investorId } from "/investor/testdata.ts";

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
