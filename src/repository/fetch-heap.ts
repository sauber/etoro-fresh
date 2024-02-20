import type { ChartData } from "./chart.ts";
import type { DiscoverData } from "./discover.ts";
import type { PortfolioData } from "./portfolio.ts";
import type { StatsData } from "./stats.ts";

import { FetchBackend } from "./mod.ts";
import type { DiscoverFilter, InvestorId } from "./mod.ts";

type Assets = {
  discover: DiscoverData;
  chart: ChartData;
  portfolio: PortfolioData;
  stats: StatsData;
};

/** Test class to fetch from variables instead of website */
export class FetchHeapBackend implements FetchBackend {
  constructor(private readonly assets: Assets) {}

  public discover(_filter: DiscoverFilter): Promise<DiscoverData> {
    return Promise.resolve(this.assets.discover);
  }

  public chart(_investor: InvestorId): Promise<ChartData> {
    return Promise.resolve(this.assets.chart);
  }

  public portfolio(_investor: InvestorId): Promise<PortfolioData> {
    return Promise.resolve(this.assets.portfolio);
  }

  public stats(_investor: InvestorId): Promise<StatsData> {
    return Promise.resolve(this.assets.stats);
  }
}
