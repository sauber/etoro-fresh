import { diffDate, nextDate } from "/utils/time/mod.ts";
import type { DateFormat } from "/utils/time/mod.ts";

/** Numbers by date */
export class Chart {
  public readonly start: DateFormat;

  constructor(
    public readonly values: number[],
    public readonly end: DateFormat
  ) {
    this.start = nextDate(this.end, -this.values.length + 1);
  }

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
        `Date not in range: ${this.start} < ${date} < ${this.end}`
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

  /** Sub chart with entries starting on date */
  public from(date: DateFormat): Chart {
    const offset = diffDate(this.start, date);
    const trimmed = this.values.slice(offset);
    return new Chart(trimmed, this.end);
  }

  /** Sub chart with entries until and including date */
  public until(date: DateFormat): Chart {
    const count = diffDate(this.start, date);
    const trimmed = this.values.slice(0, count + 1);
    return new Chart(trimmed, this.start);
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
  public add(a: number): Chart {
    return new Chart(
      this.values.map((x) => x + a),
      this.start
    );
  }

  /** Raise each value to the power of a */
  public pow(a: number): Chart {
    return new Chart(
      this.values.map((x) => Math.pow(x, a)),
      this.start
    );
  }

  /** max(0,a) */
  public get relu(): Chart {
    return new Chart(
      this.values.map((x) => Math.max(0, x)),
      this.start
    );
  }

  /** Standard Deviation */
  public get std(): number {
    const avg = this.avg;
    const diff = this.add(-avg);
    const d2 = diff.pow(2);
    const std = Math.sqrt(d2.sum / (this.length-1));
    return std;
  }

  /** Value as ratio above previous value */
  public get win(): Chart {
    const v = this.values;
    return new Chart(
      v.map((a, i) => (i == 0 ? 0 : a / v[i - 1] - 1)).slice(1),
      nextDate(this.start, -1)
    );
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

    const volatility = new Chart(incrementals, this.start).std;

    // Sharpe Ratio
    const sharpe = (profit - benchmark) / volatility;

    if (!Number.isFinite(sharpe)) {
      console.log({
        riskfree,
        profit,
        benchmark,
        incrementals,
        volatility,
        sharpe,
      });
      throw new Error("Invalid SharpeRatio");
    }

    return sharpe;
  }

  /** Ratio of gain from arbitrary date to another */
  public gain(start: DateFormat, end: DateFormat): number {
    const first: number = this.value(start);
    const last: number = this.value(end);
    const ratio = last / first - 1;
    return ratio;
  }

  /** Average yearly Profit */
  public get apy(): number {
    const profit: number = this.last / this.first - 1;
    const apy: number = (365 / (this.length - 1)) * profit;
    return apy;
  }
}
