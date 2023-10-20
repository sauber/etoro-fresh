import { DateSeries, diffDate, nextDate } from "/utils/time/mod.ts";
import type { DateFormat } from "/utils/time/mod.ts";

export class ChartSeries implements DateSeries<number> {
  constructor(
    private readonly values: number[],
    private readonly firstDate: DateFormat,
  ) {}

  dates(): DateFormat[] { 
    const dates: DateFormat[] = [];
    let date = this.firstDate;
    for ( const _value of this.values ) {
      dates.push(date);
      date = nextDate(date);
    }
    return dates;
  };

  value(date: DateFormat): number {
    const index: number = diffDate(this.firstDate, date);
    if ( index < 0 || index >= this.values.length) throw new Error(`Date not in range: ${this.firstDate} < ${date} < ${this.end()}`);
    return this.values[index];
  }

  start(): DateFormat {
    return this.firstDate;
  }

  end(): DateFormat {
    return nextDate(this.firstDate, this.values.length - 1);
  }

  first(): number {
    return this.values[0];
  }

  last(): number {
    return this.values[this.values.length - 1];
  }
}
