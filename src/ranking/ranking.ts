import { DateFormat, diffDate } from "/utils/time/mod.ts";
import { ChartSeries, Community, Investor } from "/investor/mod.ts";
import type { Names, StatsData } from "/investor/mod.ts";
import { Asset } from "/repository/mod.ts";

export class Ranking {
  constructor(private readonly community: Community) {}

  public names(): Promise<Names> {
    return this.community.names();
  }

  /** Projected yearly profit */
  public async gain(username: string): Promise<number> {
    // Find oldest stats in range of chart
    const investor: Investor = this.community.investor(username);
    const chart: ChartSeries = await investor.chart();

    // Date range
    const chartStart: DateFormat = chart.start();
    const chartEnd: DateFormat = chart.end();
    const stats: Asset<StatsData> = investor.statsSeries;
    const statsStart: DateFormat = await stats.after(chartStart);
    const days: number = diffDate(statsStart, chartEnd);
    if (days == 0) return 0;
    if (days < 0) throw new Error("No stats in chart periode");

    // Calculate APY
    const first: number = chart.value(statsStart);
    const last: number = chart.value(chartEnd);
    const profit: number = last / first - 1;
    const apy: number = 365 / days * profit;

    //console.log({chartStart, chartEnd, statsStart, first, last, profit, days, apy});

    return apy;
  }
}
