import { DiskBackend, Asset } from "../storage/mod.ts";
import type { InvestorId, DiscoverFilter } from "./mod.ts";
import type { DiscoverData } from "./discover.ts";
import type { ChartData } from "./chart.ts";
import type { PortfolioData } from "./portfolio.ts";
import type { StatsData } from "./stats.ts";

const path = "testdata";
export const repo = new DiskBackend(path);
export const investorId: InvestorId = {
  CustomerId: 4657429,
  UserName: "GainersQtr",
};
export const discoverFilter: DiscoverFilter = { risk: 4, daily: 6, weekly: 11 };

// Most recent asset data
const n = investorId.UserName;
export const testAssets = {
  discover: await new Asset<DiscoverData>("discover", repo).last(),
  chart: await new Asset<ChartData>(n + ".chart", repo).last(),
  portfolio: await new Asset<PortfolioData>(n + ".portfolio", repo).last(),
  stats: await new Asset<StatsData>(n + ".stats", repo).last(),
};
