import { diffDate, nextDate } from "📚/time/mod.ts";
import type { DateFormat } from "📚/time/mod.ts";
import { std } from "📚/math/statistics.ts";
import { ema, rsi, sma } from "./indicators.ts";

type Numbers = number[];

/** Numbers by date */
export class Chart {
  public readonly start: DateFormat;

  constructor(
    public readonly values: Numbers,
    public readonly end: DateFormat,
  ) {
    this.start = nextDate(this.end, -this.values.length + 1);
  }

  //////////////////////////////////////////////////////////////////////
  /// Lookup values
  //////////////////////////////////////////////////////////////////////

  /** List of all dates */
  public get dates(): DateFormat[] {
    const dates: DateFormat[] = [];
    let date = this.start;
    for (const _value of this.values) {
      dates.push(date);
      date = nextDate(date);
    }
    return dates;
  }

  /** Lookup value on date */
  public value(date: DateFormat): number {
    const index: number = diffDate(this.start, date);
    if (index < 0 || index >= this.values.length) {
      throw new Error(
        `Date not in range: ${this.start} < ${date} < ${this.end}`,
      );
    }
    return this.values[index];
  }

  public get first(): number {
    return this.values[0];
  }

  public get last(): number {
    return this.values[this.values.length - 1];
  }

  public get length(): number {
    return this.values.length;
  }

  //////////////////////////////////////////////////////////////////////
  /// Aggregate statistics
  //////////////////////////////////////////////////////////////////////

  /** Add all values together */
  public get sum(): number {
    return this.values.reduce((sum, a) => sum + a, 0);
  }

  /** Average of numbers */
  public get avg(): number {
    return this.sum / this.length;
  }

  /** Standard Deviation */
  public get std(): number {
    return std(this.values);
  }

  /**
   * Sharpe Ratio, riskfree is annual riskfree return, for example 0.05
   * TODO: Research if other similar indicator are better for this project
   */
  public sharpeRatio(riskfree: number): number {
    // Daily benchmark and daily average profit
    const profit = (this.last / this.first - 1) / (this.length - 1);
    const benchmark = riskfree / 365;

    // std of incrementals
    const incrementals = this.win.values.filter((x) => x > 0);
    if (incrementals.length == 0) return -riskfree;
    const volatility = std(incrementals);

    // Sharpe Ratio
    const sharpe = (profit - benchmark) / volatility;
    return sharpe;
  }

  /** Ratio of gain from arbitrary date to another */
  public gain(start: DateFormat, end: DateFormat): number {
    const first: number = this.value(start);
    const last: number = this.value(end);
    const ratio = last / first - 1;
    return ratio;
  }

  /** Annual Percentage Yield */
  public get apy(): number {
    const profit: number = this.last / this.first - 1;
    const apy: number = (365 / (this.length - 1)) * profit;
    return apy;
  }

  //////////////////////////////////////////////////////////////////////
  /// Derived Charts
  //////////////////////////////////////////////////////////////////////

  /** Create a derived chart, cache for future use */
  private readonly subcharts: Record<string, Chart> = {};
  private derive(
    values: Numbers,
    id: string,
    enddate: DateFormat = this.end,
  ): Chart {
    if (!(id in this.subcharts)) {
      this.subcharts[id] = new Chart(values, enddate);
    }
    return this.subcharts[id];
  }

  /** Sub chart with entries starting on date */
  public from(start: DateFormat): Chart {
    const offset: number = diffDate(this.start, start);
    const trimmed: Numbers = this.values.slice(offset);
    return this.derive(trimmed, "from" + start);
  }

  /** Sub chart with entries until and including date */
  public until(end: DateFormat): Chart {
    const count: number = diffDate(this.start, end);
    const trimmed: Numbers = this.values.slice(0, count + 1);
    return this.derive(trimmed, "until" + end, end);
  }

  /** Value as ratio above previous value */
  private get win(): Chart {
    const v: Numbers = this.values;
    return this.derive(
      v.map((a, i) => (i == 0 ? 0 : a / v[i - 1] - 1)).slice(1),
      "win",
    );
  }

  /** Simple Moving Average */
  public sma(window: number): Chart {
    return this.derive(sma(this.values, window), "sma" + window);
  }

  /** Exponential Moving Average */
  public ema(window: number): Chart {
    return this.derive(ema(this.values, window), "ema" + window);
  }

  /** Relative Strength Index */
  public rsi(window: number): Chart {
    return this.derive(rsi(this.values, window), "rsi" + window);
  }

  /** this chart - other chart */
  public subtract(other: Chart): Chart {
    const start: DateFormat = this.start > other.start ? this.start : other.start;
    const end: DateFormat = this.end < other.end ? this.end : other.end;

    const parent = this.from(start).until(end).values;
    const child = other.from(start).until(end).values;
    const diff = parent.map((n, i)=> n-child[i]);
    return new Chart(diff, end);
  }
}
