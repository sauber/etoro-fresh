import { DateFormat, nextDate } from "/utils/time/mod.ts";
import { Community, Investor, ChartSeries, Names } from "/investor/mod.ts";
import { ObjectSeries, Series } from "/utils/series.ts";
import { Strategy, StrategyClass } from "./strategy.ts";
import type { Orders } from "./strategy.ts";
import { Exchange } from "./exchange.ts";
import { Book } from "./book.ts";
import { Portfolio } from "./portfolio.ts";
import type { Positions } from "./portfolio.ts";
import { DataFrame } from "📚/utils/dataframe.ts";

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
    //console.log(this.strategy);
    this.exchange = new Exchange(community);
    this.book = new Book();
    this.book.deposit(cash, start);
    this.portfolio = this.book.portfolio;
  }

  /** Calculate value of portfolio */
  private valuate(date: DateFormat): void {
    this.book.valuate(date);
  }

  /** Close any positions with expired underlying data */
  private expire(date: DateFormat): void {
    const expired: Positions = this.portfolio.expired(date);
    for (const position of expired) this.book.remove(position, date, "expire");
  }

  /** Generate a strategy for the current dat and current portfolio */
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
    const strategy = await this.StrategyInstance(date);
    const open: Orders = await strategy.open();
    for (const order of open) {
      const position = await this.exchange.buy(order.name, date, order.amount);
      this.book.add(position);
    }
  }

  /** Close all positions suggested by strategy */
  private async close(date: DateFormat): Promise<void> {
    const strategy = await this.StrategyInstance(date);
    const close: Positions = await strategy.close();
    for (const order of close) {
      const _refund = await this.exchange.sell(order, date);
      this.book.remove(order, date, "sell");
    }
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
    const value = df.column("value") as Series;
    return new ChartSeries(value.values, this.start);
  }
}
