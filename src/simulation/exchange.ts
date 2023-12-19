import { DateFormat } from "📚/utils/time/mod.ts";
import { Community, Investor, ChartSeries } from "/investor/mod.ts";
import { Position } from "./position.ts";

/** An exchange is a place where cash and positions are swapped for a fee */
export class Exchange {
  constructor(
    private readonly community: Community,
    private readonly spread: number = 0.001
  ) {}

  /** Generate a position from cash */
  public async buy(
    username: string,
    date: DateFormat,
    amount: number
  ): Promise<Position> {
    const investor: Investor = this.community.investor(username);
    const chart: ChartSeries = await investor.chart();
    const fee = amount * this.spread;
    const deducted = amount - fee;
    const position = new Position({
      name: username,
      open: date,
      expire: chart.end(),
      chart: chart,
      amount: deducted
    });
    return position;
  }

  /** Sell a position on a date, return cash */
  public sell(position: Position, date: DateFormat): number {
    const value = position.value(date);
    const deducted = value - value * this.spread;
    return deducted;
  }
}
