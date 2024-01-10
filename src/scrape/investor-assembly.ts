import type { DateFormat } from "📚/utils/time/mod.ts";
import { Asset, Backend } from "/repository/mod.ts";

import type { ChartData } from "./chart.ts";
import { Chart } from "./chart.ts";
import { diffDate } from "📚/utils/time/calendar.ts";

// type ChartExtract = {
//   end: DateFormat;
//   values: number[];
// };

/** Extract scraped data and compile an investor object */
export class InvestorAssembly {
  private readonly chartAsset: Asset<ChartData>;
  // private readonly portfolioSeries: Asset<PortfolioData>;
  // public readonly statsSeries: Asset<StatsData>;

  constructor(public readonly UserName: string, readonly repo: Backend) {
    this.chartAsset = new Asset<ChartData>(this.UserName + ".chart", repo);
    // this.portfolioSeries = new Asset(this.UserName + ".portfolio");
    // this.statsSeries = new Asset(this.UserName + ".stats");
  }

  // /** Load one chart files and extract series */
  // private async series(date: DateFormat): Promise<ChartSeries> {
  //   const data: ChartData = await this.chartSeries.value(date);
  //   const chart: Chart = new Chart(data);
  //   const series: ChartSeries = chart.series();
  //   return series;
  // }

  /** Combination of as few charts as possible from start to end */
  public async chart(): Promise<number[]> {
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
    return price;
  }

  // /** Extract essential latest stats */
  // public async stats(): Promise<StatsExport> {
  //   const raw = await this.statsSeries.last();
  //   const stats = new Stats(raw);
  //   return stats.export();
  // }

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
