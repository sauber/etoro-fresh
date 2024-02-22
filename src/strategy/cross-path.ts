import { matchesUrl } from "$fresh/src/runtime/active_url.ts";
import { Chart } from "📚/chart/mod.ts";
import { nextDate } from "📚/utils/time/mod.ts";
import type { DateFormat } from "📚/utils/time/mod.ts";

/** Crossing Path strategy looks for when fast SMA crosses slow SMA */
export class CrossPath {
  private readonly slow: Chart;
  private readonly fast: Chart;
  private readonly start: DateFormat;
  private readonly end: DateFormat;

  constructor(
    private readonly chart: Chart,
    fastWindow: number,
    slowWindow: number,
  ) {
    this.slow = chart.sma(slowWindow);
    this.fast = chart.sma(fastWindow);
    this.start = nextDate(this.slow.start);
    this.end = chart.end;
  }

  /** Trading signal on date */
  public value(date: DateFormat): number {
    //console.log('cross-path value on date', date);
    const prev: DateFormat = nextDate(date, -1);

    const s: number = this.slow.value(date);
    const s1: number = this.slow.value(prev);
    const f: number = this.fast.value(date);
    const f1: number = this.fast.value(prev);

    const crossOver: boolean = f > s && f1 < s1;
    const crossUnder: boolean = f < s && f1 > s1;

    if (crossOver) {
      // Strong buy when both trend up
      if (s > s1 && f > f1) return 1;
      // Weak buy
      return 0.5;
    }

    if (crossUnder) {
      // Strong sell when both trend down
      if (s < s1 && f > f1) return -1;
      // Weak sell
      return -0.5;
    }

    // No signal
    return 0;
  }

  public get dates(): DateFormat[] {
    const result: DateFormat[] = [];
    let date: DateFormat = this.start;
    while (date <= this.end) {
      result.push(date);
      date = nextDate(date);
    }
    return result;
  }

  /** All trading signals */
  public get values(): number[] {
    return this.dates.map((date) => this.value(date));
  }
}

/** Define boundaries of parameters for CrossPath Strategy */
type Parameter = "fast" | "slow";

export class CrossPathParameters {
  public readonly names = ['fast', 'slow'];
  private readonly min = 2;
  private readonly max = 200;
  public fast: number;
  public slow: number;

  constructor() {
    this.fast = this.min + Math.round(Math.random()*(this.max/2 - this.min));
    this.slow = 1 + this.fast + Math.round(Math.random()*(this.max-this.fast));
  }

  /** Min and max for parameter */
  public boundary(param: Parameter): {min: number, max: number} {
    if ( param == "fast" ) return {min: this.min, max: this.slow-1};
    if ( param == "slow" ) return {min: this.fast+1, max: this.max};
    return {min: NaN, max: NaN};
  }

  /** Change one parameter by amount */
  step(param: Parameter, amount: number): void {
    const b = this.boundary(param);
    const d = Math.round(amount)
    if ( this[param] + d > b.max ) this[param] = b.max
    else if ( this[param] + d < b.min ) this[param] = b.min
    else this[param] += d;
  }
}