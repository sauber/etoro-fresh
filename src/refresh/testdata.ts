import { config, repoBackend } from "/repository/testdata.ts";
export { config } from "/repository/testdata.ts";
import type { JSONObject } from "../repository/mod.ts";
import { Assets } from "./fetch-heap.ts";
import { investorId } from "/investor/testdata.ts";
import type { DiscoverFilter } from "./mod.ts";

export const discoverOptions: DiscoverFilter = (await config.get("discover")) as DiscoverFilter;

// Pull from repo a collection of assets
export const testAssets: Assets = {
  // discover
  discover: (await repoBackend.retrieve("discover")) as JSONObject,

  // chart
  chart: (await repoBackend.retrieve(
    investorId.UserName + ".chart"
  )) as JSONObject,

  // portfolio
  portfolio: (await repoBackend.retrieve(
    investorId.UserName + ".portfolio"
  )) as JSONObject,

  // stats
  stats: (await repoBackend.retrieve(
    investorId.UserName + ".stats"
  )) as JSONObject,
};
