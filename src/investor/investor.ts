/*
import { Repo } from "./repo.ts";
import { Portfolio } from "./portfolio.ts";
import { Stats } from "./stats.ts";
import { Chart } from "./chart.ts";
*/

import { Asset } from "/repository/mod.ts";
import { ChartData, PortfolioData, StatsData } from "./mod.ts";
import { ChartSeries } from "./chart-series.ts";
import { Chart } from "./chart.ts";
import { DateFormat } from "/utils/time/mod.ts";

export class Investor {
  constructor(
    private readonly chartSeries: Asset<ChartData>,
    private readonly portfolioSeries: Asset<PortfolioData>,
    private readonly statsSeries: Asset<StatsData>
  ) {}
  /*
  readonly portfolio: Portfolio;
  readonly stats: Stats;
  readonly chart: Chart;

  constructor(private readonly repo: Repo, readonly username: string, readonly cid: number) {
    this.portfolio = new Portfolio(repo, username, cid);
    this.stats = new Stats(repo, username, cid);
    this.chart = new Chart(repo, username, cid);
  }
 */

  /** Load chart and extract series */
  private async series(date: DateFormat): Promise<ChartSeries> {
    const data: ChartData = await this.chartSeries.value(date);
    const chart: Chart = new Chart(data);
    const series: ChartSeries = chart.series();
    return series;
  }

  public async chartAssembly(): Promise<ChartSeries> {
    const dates = await this.chartSeries.dates();
    let series: ChartSeries = await this.series(dates[dates.length-1]);
    let start: DateFormat = series.start();

    // Prepend older charts
    for (let i = dates.length - 2; i >= 0; i--) {
      const date = dates[i];
      if (i == 0 || (start && date >= start && dates[i - 1] < start)) {
        series = series.combine(await this.series(date));
        start = series.start();
      }
    }
    return series;
  }
}
