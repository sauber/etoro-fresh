import { Asset } from "/repository/mod.ts";
import type {
  ChartData,
  InvestorExport,
  InvestorId,
  PortfolioData,
  StatsData,
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
    public readonly statsSeries: Asset<StatsData>,
  ) {}

  /** Load chart and extract series */
  private async series(date: DateFormat): Promise<ChartSeries> {
    const data: ChartData = await this.chartSeries.value(date);
    const chart: Chart = new Chart(data);
    const series: ChartSeries = chart.series();
    return series;
  }

  /** Combination of as few charts as possible from start to end */
  private _chart: ChartSeries | null = null;
  public async chart(): Promise<ChartSeries> {
    if (this._chart) return this._chart; // Caching

    const dates = await this.chartSeries.dates();
    let series: ChartSeries = await this.series(dates[dates.length - 1]);
    let start: DateFormat = series.start();

    // Prepend older charts
    // Search backwards for the chart oldest chart with overlap
    for (let i = dates.length - 2; i >= 0; i--) {
      const date = dates[i];
      if (date < start) break; // Too old to overlap
      if (i > 0 && dates[i - 1] >= start) continue; // An even older exists and overlaps

      series = series.combine(await this.series(date));
      start = series.start();
    }
    this._chart = series;
    return series;
  }

  /** Extract essential latest stats */
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

  /** Combine data into one structure */
  public async export(): Promise<InvestorExport> {
    const chart = await this.chart();
    return {
      chart: [chart.dates(), chart.values],
      mirrors: await this.mirrors(),
      stats: await this.stats(),
    };
  }

  /** Confirm if any charts exists, and stats within chart range */
  public async isValid(): Promise<boolean> {
    const dates: DateFormat[] = await this.chartSeries.dates();
    if (dates.length < 1) return false;
    const chart = await this.chart();
    const chart_start: DateFormat = chart.start();
    const chart_end: DateFormat = chart.end();
    const stats = await this.statsSeries;
    const stats_start: DateFormat = await stats.start();
    const stats_end: DateFormat = await stats.end();
    //console.log({chart_start, chart_end, stats_start, stats_end});
    if (stats_end < chart_start) return false;
    if (stats_start > chart_end) return false;
    return true;
  }

  /** Lookup CustomerId */
  public async CustomerId(): Promise<number> {
    return (await this.stats()).CustomerId as number;
  }

  /** Lookup CustomerId */
  public async FullName(): Promise<string> {
    return (await this.stats()).FullName as string;
  }
}
