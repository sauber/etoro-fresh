//import { config, repoBackend } from "../repository/old/testdata.ts";
//export { config } from "../repository/old/testdata.ts";
//import { DiskBackend, type JSONObject } from "../repository/mod.ts";
import { DiskBackend, Journal } from "📚/repository/mod.ts";
import { Assets } from "./fetch-heap.ts";
//import { investorId } from "/investor/testdata.ts";
//export { investorId } from "/investor/testdata.ts";
//import type { InvestorId, DiscoverFilter } from "./mod.ts";
import type {
  InvestorId,
  DiscoverData,
  ChartData,
  PortfolioData,
  StatsData,
} from "./mod.ts";

const path = "testdata";
const repo = new DiskBackend(path);
const journal = new Journal(repo);
export const investorId: InvestorId = { CustomerId: 4657429, UserName: "GainersQtr" };
const name = investorId.UserName;
//const discoverFilter: DiscoverFilter = { risk: 4, daily: 6, weekly: 11 };

// Pull from repo a collection of assets
export const testAssets: Assets = {
  // discover
  discover: await journal.asset<DiscoverData>("discover").last(),

  // chart
  chart: await journal.asset<ChartData>(name + ".chart").last(),

  // portfolio
  portfolio: await journal.asset<PortfolioData>(name + ".portfolio").last(),

  // stats
  stats: await journal.asset<StatsData>(name + ".stats").last(),
};
