import type { DateFormat } from "📚/utils/time/mod.ts";
import { diffDate, nextDate } from "📚/utils/time/calendar.ts";
import { Asset, Backend } from "/repository/mod.ts";

import type { ChartData } from "./chart.ts";
import { Chart } from "./chart.ts";

import type { StatsData } from "./stats.ts";
//import { Stats } from "./stats.ts";

type StatsEssentials = {
  DailyDD: number;
  WeeklyDD: number;
};

type StatsExtract = Record<string, StatsEssentials>;

/** Extract scraped data and compile an investor object */
export class InvestorAssembly {
  private readonly chartAsset: Asset<ChartData>;
  // private readonly portfolioSeries: Asset<PortfolioData>;
  private readonly statsAsset: Asset<StatsData>;

  constructor(public readonly UserName: string, readonly repo: Backend) {
    this.chartAsset = new Asset<ChartData>(this.UserName + ".chart", repo);
    // this.portfolioSeries = new Asset(this.UserName + ".portfolio");
    this.statsAsset = new Asset<StatsData>(this.UserName + ".stats", repo);
  }

  /** Customer ID */
  public async CustomerId(): Promise<number> {
    const stats: StatsData = await this.statsAsset.last();
    const id: number = stats.Data.CustomerId;
    return id;
  }

  /** First date of combined charts */
  public async start(): Promise<DateFormat> {
    const chart: number[] = await this.chart();
    const end: DateFormat = await this.end();
    const days: number = chart.length;
    const start: DateFormat = nextDate(end, -days + 1);
    return start;
  }

  /** Last date where chart is present */
  public end(): Promise<DateFormat> {
    return this.chartAsset.end();
  }

  /** Combination of as few charts as possible from start to end */
  private _chart: number[] | null = null;
  public async chart(): Promise<number[]> {
    if (this._chart) return this._chart;

    // All dates having a chart
    const dates: DateFormat[] = await this.chartAsset.dates();

    // Load latest chart
    const end: DateFormat = dates[dates.length - 1];
    const lastData: ChartData = await this.chartAsset.retrieve(end);
    const lastChart = new Chart(lastData);
    const values: number[] = lastChart.values;
    let start: DateFormat = lastChart.start;

    // Prepend older charts
    // Search backwards to find oldest chart which still overlaps
    for (let i = dates.length - 2; i >= 0; i--) {
      const date = dates[i];
      if (date < start) break; // Too old to overlap
      if (i > 0 && dates[i - 1] >= start) continue; // An even older exists and overlaps

      // Load older chart
      const sooner: Chart = new Chart(await this.chartAsset.retrieve(date));

      // Does newer chart fully overlap older?
      if (sooner.start >= start) break;

      // How many days from sooner to prepend
      const days: number = diffDate(sooner.start, start);

      // Amount to scale values from sooner
      const scale: number = values[0] / sooner.values[days];

      // Array to be prepended
      const prepend: number[] = sooner.values
        .slice(0, days)
        .map((value) => value * scale);
      //console.log({date, days, scale, prepend});
      values.splice(0, 0, ...prepend);

      // New start
      start = sooner.start;
    }

    // Truncate floating digits to 2
    const price = values.map((v) => +v.toFixed(2));
    // Caching
    this._chart = price;
    return price;
  }

  /** Extract essential data from stats on date */
  private async statsValues(date: DateFormat): Promise<StatsEssentials> {
    const loaded: StatsData = await this.statsAsset.retrieve(date);
    const s = loaded.Data;
    return {
      DailyDD: s.DailyDD,
      WeeklyDD: s.WeeklyDD,
    };
  }

  /** Extract stats for all available dates within chart range */
  public async stats(): Promise<StatsExtract> {
    // Dates
    const start: DateFormat = await this.start();
    const end: DateFormat = await this.end();
    const dates: DateFormat[] = await this.statsAsset.dates();
    const range: DateFormat[] = dates.filter(
      (date) => date >= start && date <= end
    );

    // Data
    const data: StatsEssentials[] = await Promise.all(
      range.map((date) => this.statsValues(date))
    );

    // Zip
    const zip: StatsExtract = {};
    range.forEach((date, index) => (zip[date] = data[index]));
    return zip;
  }

  // /** Latest mirrors */
  // public async mirrors(): Promise<InvestorId[]> {
  //   const raw = await this.portfolioSeries.last();
  //   const portfolio = new Portfolio(raw);
  //   return portfolio.investors();
  // }

  // /** Combine data into one structure */
  // public async export(): Promise<InvestorExport> {
  //   const chart = await this.chart();
  //   return {
  //     chart: [chart.dates(), chart.values],
  //     mirrors: await this.mirrors(),
  //     stats: await this.stats(),
  //   };
  // }

  // /** First date of chart or first date of stats */
  // public async start(): Promise<DateFormat | null> {
  //   const dates: DateFormat[] = await this.chartSeries.dates();
  //   if (dates.length < 1) return null;

  //   // First date in chart
  //   const chart = await this.chart();
  //   const chart_start: DateFormat = chart.start();

  //   // First date of stats
  //   const stats = this.statsSeries;
  //   const stats_start: DateFormat = await stats.start();

  //   // At least on stat must come before end of chart
  //   return stats_start <= chart_start ? chart_start : stats_start;
  // }

  // /** Last date of chart */
  // public async end(): Promise<DateFormat | null> {
  //   const dates: DateFormat[] = await this.chartSeries.dates();
  //   if (dates.length < 1) return null;

  //   // Last date in chart
  //   const chart = await this.chart();
  //   const chart_end: DateFormat = chart.end();

  //   // First date of stats
  //   const stats = this.statsSeries;
  //   const stats_start: DateFormat = await stats.start();

  //   // At least one stat must come before end of chart
  //   return stats_start <= chart_end ? chart_end : null;
  // }

  // /** Confirm if any charts exists, and stats within chart range */
  // public async isValid(): Promise<boolean> {
  //   // Confirm start exists
  //   const start = await this.start();
  //   if (!start) return false;

  //   // Confirm end exists
  //   const end = await this.end();
  //   if (!end) return false;

  //   // Confirm start is before end
  //   if (start > end) return false;

  //   // All conditions met
  //   return true;
  // }

  // /** Lookup CustomerId */
  // public async CustomerId(): Promise<number> {
  //   return (await this.stats()).CustomerId as number;
  // }

  // /** Lookup CustomerId */
  // public async FullName(): Promise<string> {
  //   return (await this.stats()).FullName as string;
  // }

  // /** Gain from start date to end date */
  // public async gain(start: DateFormat, end: DateFormat): Promise<number> {
  //   return (await this.chart()).gain(start, end);
  // }

  // /** Confirm if valid data exists on date */
  // public async active(date: DateFormat): Promise<boolean> {
  //   // Confirm start exists and prior to date
  //   const start = await this.start();
  //   if (!start) return false;
  //   if (date < start) return false;

  //   // Confirm end exists and after date
  //   const end = await this.end();
  //   if (!end) return false;
  //   if (end < date) return false;

  //   // Date is within start and end
  //   return true;
  // }
}
