import { Asset, RepoBackend } from "/repository/mod.ts";
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
  private readonly chartSeries: Asset<ChartData>;
  private readonly portfolioSeries: Asset<PortfolioData>;
  public readonly statsSeries: Asset<StatsData>;

  constructor(public readonly UserName: string, repo: RepoBackend) {
    this.chartSeries = repo.asset(this.UserName + ".chart");
    this.portfolioSeries = repo.asset(this.UserName + ".portfolio");
    this.statsSeries = repo.asset(this.UserName + ".stats");
  }

  /** Load one chart files and extract series */
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
    // Search backwards to find oldest chart with overlap
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

  /** First date of chart or first date of stats */
  public async start(): Promise<DateFormat | null> {
    const dates: DateFormat[] = await this.chartSeries.dates();
    if (dates.length < 1) return null;

    // First date in chart
    const chart = await this.chart();
    const chart_start: DateFormat = chart.start();

    // First date of stats
    const stats = this.statsSeries;
    const stats_start: DateFormat = await stats.start();

    // At least on stat must come before end of chart
    return stats_start <= chart_start ? chart_start : stats_start;
  }

  /** Last date of chart */
  public async end(): Promise<DateFormat | null> {
    const dates: DateFormat[] = await this.chartSeries.dates();
    if (dates.length < 1) return null;

    // Last date in chart
    const chart = await this.chart();
    const chart_end: DateFormat = chart.end();

    // First date of stats
    const stats = this.statsSeries;
    const stats_start: DateFormat = await stats.start();

    // At least on stat must come before end of chart
    return stats_start <= chart_end ? chart_end : null;
  }

  /** Confirm if any charts exists, and stats within chart range */
  public async isValid(): Promise<boolean> {
    // Confirm start exists
    const start = await this.start();
    if ( ! start ) return false;

    // Confirm end exists
    const end = await this.end();
    if ( ! end ) return false;

    // Confirm start is before end
    if ( start > end ) return false;

    // All conditions met
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

  /** Gain from start date to end date */
  public async gain(start: DateFormat, end: DateFormat): Promise<number> {
    return (await this.chart()).gain(start, end);
  }

  /** Confirm if valid data exists on date */
  public async active(date: DateFormat): Promise<boolean> {
    // Confirm start exists and prior to date
    const start = await this.start();
    if ( ! start ) return false;
    if ( date < start ) return false;

    // Confirm end exists and after date
    const end = await this.end();
    if ( ! end ) return false;
    if ( end < date ) return false;

    // Date is within start and end
    return true;
  }
}
