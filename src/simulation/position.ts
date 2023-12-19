import type { DateFormat } from "/utils/time/mod.ts";
import { ChartSeries } from "/investor/mod.ts";
import { nanoid } from "nanoid";

type PositionData = {
  // Name of investori
  name: string;
  
  // Date of opening position
  open: DateFormat;

  // The last date where data is available
  expire: DateFormat;

  // Price chart
  chart: ChartSeries;

  // Size of position
  amount: number;

  // TODO:
  // takeprofit?: number;
  // stoploss?: number;
  // trailing?: boolean;
  // days_min?: number;
  // days_max?: number;
};

/** Information about a position */
export class Position {
  public readonly amount: number;
  public readonly date: DateFormat;
  public readonly id: string = nanoid();
  public readonly name: string;

  constructor(private readonly data: PositionData) {
    this.amount = data.amount;
    this.date = data.open;
    this.name = data.name;
  }

  /** Calculate profits since opening until date */
  public profit(date: DateFormat): number {
    const chart = this.data.chart;
    const gain = chart.gain(this.data.open, date);
    const profit = this.data.amount * gain;
    return profit;
  }

  /** Value of position on date (amount + profit) */
  public value(date: DateFormat): number {
    return this.data.amount + this.profit(date);
  }

  /** Confirm if position is within date range of available investor data */
  public valid(date: DateFormat): boolean {
    return date <= this.data.expire;
  }
}
