import type { DateFormat } from "/utils/time/mod.ts";
import { ChartSeries } from "/investor/mod.ts";
import { nanoid } from "nanoid";

// TODO:
// takeprofit?: number;
// stoploss?: number;
// trailing?: boolean;
// days_min?: number;
// days_max?: number;

/** Information about a position */
export class Position {
  // Generate uniq ID
  public readonly id: string = nanoid();

  constructor(
    // Date of opening
    public readonly date: DateFormat,
    // Investor Name
    public readonly name: string,
    // Chart for investor
    private readonly chart: ChartSeries,
    // Price (nomimal + spread) at time of opening
    public readonly price: number,
    // Amount invested
    public readonly amount: number,
  ) {}

  /** Calculate profits since opening until date */
  public profit(date: DateFormat): number {
    const last = this.chart.value(date);
    const profit = this.amount * (last / this.price - 1);
    return profit;
  }

  /** Value of position on date (amount + profit) */
  public value(date: DateFormat): number {
    return this.amount + this.profit(date);
  }

  /** Confirm if position is within date range of available investor data */
  public valid(date: DateFormat): boolean {
    return date <= this.chart.end();
  }
}
