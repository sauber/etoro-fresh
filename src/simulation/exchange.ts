import type { DateFormat } from "/utils/time/mod.ts";
import { ChartSeries } from "/investor/mod.ts";
import { Position } from "./position.ts";

/** An exchange is a place where cash and positions are swapped for a fee */
export class Exchange {
  constructor(private readonly spread: number = 0.001) {}

  /** Nominal price + spread */
  public buying_price(price: number) {
    return price * (1 + this.spread);
  }

  /** Nominal price - spread */
  public selling_price(price: number) {
    return price * (1 - this.spread);
  }

  /** Generate a position from cash */
  public buy(
    date: DateFormat,
    name: string,
    chart: ChartSeries,
    amount: number,
  ): Position {
    const price: number = this.buying_price(chart.value(date));
    const position: Position = new Position(date, name, chart, price, amount);
    return position;
  }

  /** Sell a position on a date, return cash */
  public sell(date: DateFormat, position: Position): number {
    return this.selling_price(position.value(date));
  }
}
