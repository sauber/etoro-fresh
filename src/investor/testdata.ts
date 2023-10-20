import { config, repoBackend } from "/repository/testdata.ts";
import type { InvestorId } from "/investor/mod.ts";
import type { ChartData } from "./chart.ts";
import type { PortfolioData } from "./portfolio.ts";
import type { StatsData } from "./stats.ts";

export const investorId: InvestorId = {
  UserName: (await config.get("UserName")) as string,
  CustomerId: (await config.get("CustomerId")) as number,
};

// TODO: Use generic type function
export const chartData = await repoBackend.retrieve(investorId.UserName + '.stats') as unknown as ChartData;
export const portfolioData = await repoBackend.retrieve(investorId.UserName + '.portfolio') as unknown as PortfolioData;
export const statsData = await repoBackend.retrieve(investorId.UserName + '.stats') as unknown as StatsData;

