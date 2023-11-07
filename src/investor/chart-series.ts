import { DateSeries, diffDate, nextDate } from "/utils/time/mod.ts";
import type { DateFormat } from "/utils/time/mod.ts";

export class ChartSeries implements DateSeries<number> {
  constructor(
    readonly values: number[],
    private readonly firstDate: DateFormat,
  ) {}

  public dates(): DateFormat[] {
    const dates: DateFormat[] = [];
    let date = this.firstDate;
    for (const _value of this.values) {
      dates.push(date);
      date = nextDate(date);
    }
    return dates;
  }

  public value(date: DateFormat): number {
    const index: number = diffDate(this.firstDate, date);
    if (index < 0 || index >= this.values.length) {
      throw new Error(
        `Date not in range: ${this.firstDate} < ${date} < ${this.end()}`,
      );
    }
    return this.values[index];
  }

  public start(): DateFormat {
    return this.firstDate;
  }

  public end(): DateFormat {
    return nextDate(this.firstDate, this.values.length - 1);
  }

  public first(): number {
    return this.values[0];
  }

  public last(): number {
    return this.values[this.values.length - 1];
  }

  /** Combine two series */
  public combine(other: ChartSeries): ChartSeries {
    // Sort by end date
    const [sooner, later] = other.end() <= this.end()
      ? [other, this]
      : [this, other];

    // Non overlap
    if (sooner.end() < later.start()) {
      return later;
      //throw new Error(`Chart Series do not overlap: ${sooner.start()}:${sooner.end()} < ${later.start()}:${later.end()}`);
    }

    // 'later' fully overlaps 'sooner'
    if (sooner.start() >= later.start()) return later;

    // How many days from sooner must be preprended
    const days = diffDate(sooner.start(), later.start());
    // How much must sooner be scaled
    const scale = later.first() / sooner.value(later.start());
    // Array to be prepended
    const prepend: number[] = sooner.values
      .slice(0, days)
      .map((value) => value * scale);
    return new ChartSeries([...prepend, ...later.values], sooner.start());
  }

  /** Sub chart with entries starting on date */
  public from(date: DateFormat): ChartSeries {
    const offset = diffDate(this.firstDate, date);
    //const count = this.values.length - offset;
    //const first: DateFormat = this.firstDate;
    const end: number = this.values.length;
    //console.log({first, length, date, offset, count});
    const trimmed = this.values.slice(offset, end);
    //console.log({trimmed});
    return new ChartSeries(trimmed, date);
  }

  /** Sub chart with entries until and including date */
  public until(date: DateFormat): ChartSeries {
    const count = diffDate(this.firstDate, date);
    const trimmed = this.values.slice(0, count + 1);
    return new ChartSeries(trimmed, this.firstDate);
  }

  public get length(): number {
    return this.values.length;
  }

  /** Add all values together */
  public get sum(): number {
    return this.values.reduce((sum, a) => sum + a, 0);
  }

  /** Average of numbers */
  public get avg(): number {
    return this.sum / this.length;
  }

  /** Add same number to each value */
  public add(a: number): ChartSeries {
    return new ChartSeries(this.values.map((x) => x + a), this.firstDate);
  }

  /** Raise each value to the power of a */
  public pow(a: number): ChartSeries {
    return new ChartSeries(
      this.values.map((x) => Math.pow(x, a)),
      this.firstDate,
    );
  }

  /** max(0,a) */
  public get relu(): ChartSeries {
    return new ChartSeries(
      this.values.map((x) => Math.max(0, x)),
      this.firstDate,
    );
  }

  /** Standard Deviation */
  public get std(): number {
    const avg = this.avg;
    const diff = this.add(-avg);
    const d2 = diff.pow(2);
    const std = Math.sqrt(d2.sum / this.length);
    return std;
  }

  /** Value as ratio above previous value */
  public get win(): ChartSeries {
    const v = this.values;
    return new ChartSeries(
      v.map((a, i) => i == 0 ? 0 : a / v[i - 1] - 1).slice(1),
      nextDate(this.firstDate, -1),
    );
  }

  /** Sharpe Ratio, riskfree is annual riskfree return, for example 0.05 */
  public sharpeRatio(riskfree: number): number {
    // Daily benchmark and daily average profit
    const profit = (this.last() / this.first() - 1) / (this.length - 1);
    const benchmark = riskfree / 365;

    // std of incrementals
    const incrementals = this.win.values.filter((x) => x > 0);
    const volatility = new ChartSeries(incrementals, this.firstDate).std;

    // Sharpe Ratio
    const sharpe = (profit - benchmark) / volatility;
    //console.log({profit, benchmark, volatility, sharpe});
    return sharpe;
  }
}
