import { DateSeries, diffDate, nextDate } from "/utils/time/mod.ts";
import type { DateFormat } from "/utils/time/mod.ts";

// TODO: Replace with DenoForge: https://deno.land/x/denoforge

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
    const [sooner, later] = ( other.end() <= this.end() )
      ? [other, this]
      : [this, other];

    // Non overlap
    if ( sooner.end() < later.start() ) throw new Error(`Chart Series do not overlap: ${sooner.start()}:${sooner.end()} < ${later.start()}:${later.end()}`)

    // 'later' fully overlaps 'sooner'
    if (sooner.start() >= later.start() ) return later;

    // How many days from sooner must be preprended
    const days = diffDate(sooner.start(), later.start());
    // How much must sooner be scaled
    const scale = later.first() / sooner.value(later.start());
    // Array to be prepended
    const prepend: number[] = sooner.values.slice(0, days).map(value => value*scale);
    return new ChartSeries([...prepend, ...later.values], sooner.start());
  }

  /** Keep entries until and including date */
  public until(date: DateFormat): ChartSeries {
    const count = diffDate(this.firstDate, date);
    const trimmed = this.values.slice(0, count+1);
    return new ChartSeries(trimmed, this.firstDate);
  }

}
