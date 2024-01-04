import { DateFormat, nextDate } from "/utils/time/mod.ts";
import { Community, Investor, ChartSeries, Names } from "/investor/mod.ts";
import { ObjectSeries } from "/utils/series.ts";
import { Strategy, StrategyClass } from "./strategy.ts";
import type { Orders } from "./strategy.ts";
import { Exchange } from "./exchange.ts";
import { Book } from "./book.ts";
import { Portfolio } from "./portfolio.ts";
import type { Positions } from "./portfolio.ts";
import { DataFrame } from "📚/utils/dataframe.ts";
import { Position } from "./position.ts";

type Investors = ObjectSeries<Investor>;

/** Simulate trading over a period */
export class Simulation {
  private readonly exchange: Exchange;
  public readonly book: Book;
  private readonly portfolio: Portfolio;

  constructor(
    private readonly start: DateFormat,
    private readonly end: DateFormat,
    private readonly community: Community,
    private readonly strategy: StrategyClass,
    private cash: number = 100000
  ) {
    this.exchange = new Exchange();
    this.book = new Book();
    this.book.deposit(start, cash);
    this.portfolio = this.book.portfolio;
  }

  /** Generate a strategy for the current date and current portfolio */
  private async StrategyInstance(date: DateFormat): Promise<Strategy> {
    const strategyClass = this.strategy;
    const names: Names = await this.community.active(date);
    const objects: Array<Investor> = await Promise.all(
      names.values.map((name) => this.community.investor(name))
    );
    const investors: Investors = new ObjectSeries(objects);
    const strategy: Strategy = new strategyClass(this.portfolio, investors);
    return strategy;
  }

  /** Open all positions suggested by strategy */
  private async open(date: DateFormat): Promise<void> {
    const strategy: Strategy = await this.StrategyInstance(date);
    const open: Orders = await strategy.open();
    for (const order of open) {
      const name: string = order.name;
      const investor: Investor = this.community.investor(name);
      const chart: ChartSeries = await investor.chart();
      const position: Position = this.exchange.buy(
        date,
        name,
        chart,
        order.amount
      );
      this.book.add(date, position);
    }
  }

  /** Close all positions suggested by strategy */
  private async close(date: DateFormat): Promise<void> {
    const strategy: Strategy = await this.StrategyInstance(date);
    const close: Positions = await strategy.close();
    for (const position of close) {
      const refund: number = this.exchange.sell(date, position);
      this.book.remove(date, position, "sell", refund);
    }
  }

  /** Close any positions with expired underlying data */
  private expire(date: DateFormat): void {
    const expired: Positions = this.portfolio.expired(date);
    const yesterday: DateFormat = nextDate(date, -1);
    for (const position of expired) {
      const selling_price: number = this.exchange.selling_price(
        position.value(yesterday)
      );
      //console.log('book.remove', date, position, selling_price);
      //throw new Error('Simulation Expire');
      this.book.remove(date, position, "expire", selling_price);
    }
  }

  /** Calculate value of portfolio */
  private valuate(date: DateFormat): void {
    this.book.valuate(date);
  }

  /** Run a trading session on a particlar date */
  private async step(date: DateFormat): Promise<void> {
    this.expire(date);
    await this.close(date);
    await this.open(date);
    this.valuate(date);
  }

  /** Run a trading sesssion each day in period */
  public async run(): Promise<void> {
    let date = this.start;
    while (date <= this.end) {
      //console.log(date);
      await this.step(date);
      date = nextDate(date);
    }
  }

  // /** Export daily performance as chart */
  public get chart(): ChartSeries {
    const df: DataFrame = this.book.export;
    const values = df.select(r => r.action === "valuate").records.map(r => r.value) as number[];
    return new ChartSeries(values, this.start);
  }
}
