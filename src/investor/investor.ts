import { Asset } from "/repository/mod.ts";
import type {
  ChartData,
  PortfolioData,
  StatsData,
  InvestorExport,
  InvestorId,
} from "./mod.ts";
import { ChartSeries } from "./chart-series.ts";
import { Chart } from "./chart.ts";
import { Stats, StatsExport } from "./stats.ts";
import type { DateFormat } from "/utils/time/mod.ts";
import { Portfolio } from "./portfolio.ts";

export class Investor {
  constructor(
    private readonly chartSeries: Asset<ChartData>,
    private readonly portfolioSeries: Asset<PortfolioData>,
    public readonly statsSeries: Asset<StatsData>
  ) {}

  /** Load chart and extract series */
  private async series(date: DateFormat): Promise<ChartSeries> {
    const data: ChartData = await this.chartSeries.value(date);
    const chart: Chart = new Chart(data);
    const series: ChartSeries = chart.series();
    return series;
  }

  /** Combination of as few charts as possible from start to end */
  public async chart(): Promise<ChartSeries> {
    const dates = await this.chartSeries.dates();
    let series: ChartSeries = await this.series(dates[dates.length - 1]);
    let start: DateFormat = series.start();

    // Prepend older charts
    // Search backwards for the chart oldest chart with overlap
    for (let i = dates.length - 2; i >= 0; i--) {
      const date = dates[i];
      if (i == 0 || (start && date >= start && dates[i - 1] < start)) {
        series = series.combine(await this.series(date));
        start = series.start();
      }
    }
    return series;
  }

  /** Essentials latest stats */
  public async stats(): Promise<StatsExport> {
    const raw = await this.statsSeries.last();
    const stats = new Stats(raw);
    return stats.export();
  }

  /** Latest mirrors */
  public async mirrors(): Promise<InvestorId[]> {
    const raw = await this.portfolioSeries.last();
    const portfolio = new Portfolio(raw);
    return portfolio.investors();
  }

  public async export(): Promise<InvestorExport> {
    const chart = await this.chart();
    return {
      chart: [chart.dates(), chart.values],
      mirrors: await this.mirrors(),
      stats: await this.stats(),
    };
  }
}
