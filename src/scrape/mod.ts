import type { DiscoverData } from "📚/scrape/discover.ts";
import type { ChartData } from "📚/scrape/chart.ts";
import type { PortfolioData } from "📚/scrape/portfolio.ts";
import type { StatsData } from "📚/scrape/stats.ts";

export interface FetchBackend {
  /** Search for investors matching criteria */
  discover(filter: DiscoverFilter): Promise<DiscoverData>;

  /** Fetch a chart object for investor  */
  chart(investor: InvestorId): Promise<ChartData>;

  /** Fetch list of investments for investor  */
  portfolio(investor: InvestorId): Promise<PortfolioData>;

  /** Fetch stats of investor  */
  stats(investor: InvestorId): Promise<StatsData>;
}

export type DiscoverFilter = {
  risk: number;
  daily: number;
  weekly: number;
};

export type InvestorId = {
  UserName: string;
  CustomerId: number;
};

export type { StatsExport } from "📚/scrape/stats.ts";
