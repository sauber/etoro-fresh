import { Chart } from "📚/chart/mod.ts";
import { nextDate, range } from "📚/time/mod.ts";
import type { DateFormat } from "📚/time/mod.ts";

/** MACD Strategy */
export class MACD {
  private readonly fast: Chart;
  private readonly slow: Chart;
  private readonly macd: Chart;
  private readonly trigger: Chart;
  private readonly start: DateFormat;
  private readonly end: DateFormat;

  constructor(
    private readonly chart: Chart,
    fastWindow: number = 12,
    slowWindow: number = 26,
    triggerWindow: number = 9,
  ) {
    this.slow = chart.ema(slowWindow);
    this.fast = chart.ema(fastWindow);
    this.macd = this.fast.subtract(this.slow);
    this.trigger = this.macd.sma(triggerWindow);

    this.start = nextDate(this.trigger.start);
    this.end = chart.end;
  }

  /** Trading signal on date */
  public value(date: DateFormat): number {
    //console.log('cross-path value on date', date);
    const prev: DateFormat = nextDate(date, -1);

    const t: number = this.trigger.value(date);
    const t1: number = this.trigger.value(prev);
    const m: number = this.macd.value(date);

    const triggerUp: boolean = t > 0 && t1 <= 0 && m > 0;
    const triggerDown: boolean = t < 0 && t1 >= 0 && m < 0;

    if (triggerUp) return 1;
    if (triggerDown) return -1;
    return 0;
  }

  public get dates(): DateFormat[] {
    return range(this.start, this.end);
  }

  /** All trading signals */
  public get values(): number[] {
    return this.dates.map((date) => this.value(date));
  }
}

/** Define boundaries of parameters for MACD Strategy */
export type Parameter = "fast" | "slow" | "trigger";

export class MACDParameters {
  public readonly names: Parameter[] = ["fast", "slow", "trigger"];
  private readonly min = 2;
  private readonly max = 200;
  public fast: number;
  public slow: number;
  public trigger: number;

  constructor() {
    this.fast = 12;
    this.slow = 26;
    this.trigger = 9;
  }

  /** Min and max for parameter, fast must be less than slow and vice versa */
  public boundary(param: Parameter): { min: number; max: number } {
    if (param == "fast") return { min: this.trigger +1, max: this.slow - 1 };
    if (param == "slow") return { min: this.fast + 1, max: this.max };
    if (param == "trigger") return { min: this.min, max: this.fast - 1 };
    return { min: NaN, max: NaN };
  }

  /** Pick a random value within boundary */
  public random(param: Parameter): number {
    const { min, max } = this.boundary(param);
    return min + Math.floor(Math.random() * (max - min));
  }

  /** Change one parameter by amount, return actual amount changed */
  step(param: Parameter, amount: number): number {
    const b = this.boundary(param);
    const d = Math.round(amount);
    let actual = 0;
    if (this[param] + d > b.max) actual = b.max;
    else if (this[param] + d < b.min) actual = b.min;
    else actual = this[param] + d;
    const before = this[param];
    this[param] = actual;
    return this[param] - before;
  }
}
