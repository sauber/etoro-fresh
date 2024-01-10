import { config, repoBackend } from "../repository/old/testdata.ts";
import type { InvestorId } from "/investor/mod.ts";
import type { ChartData } from "./chart.ts";
import type { PortfolioData } from "../scrape/portfolio.ts";
import type { StatsData } from "../scrape/stats.ts";

export const investorId = await config.get("investor") as InvestorId;

// TODO: Use generic type function
export const chartData = await repoBackend.retrieve(
  investorId.UserName + ".chart",
) as ChartData;
export const portfolioData = await repoBackend.retrieve(
  investorId.UserName + ".portfolio",
) as PortfolioData;
export const statsData = await repoBackend.retrieve(
  investorId.UserName + ".stats",
) as StatsData;
