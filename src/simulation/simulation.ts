import { DateFormat, nextDate } from "/utils/time/mod.ts";
import { Community, Investor, ChartSeries } from "/investor/mod.ts";

export type Position = {
  date: DateFormat;
  investor: Investor;
  amount: number;
  price: number;
  takeprofit?: number;
  stoploss?: number;
  trailing?: boolean;
  days_min?: number;
  days_max?: number;
};

export type Positions = Array<Position>;

abstract class Strategy {
  constructor(
    private readonly positions: Positions,
    private readonly community: Community
  ) {}
  abstract open(): Promise<Positions>;
  abstract close(): Promise<Positions>;
}

interface StrategyClass {
  new (positions: Positions, community: Community): Strategy;
}

/** Never buy, never sell */
export class NullStrategy extends Strategy {
  public open(): Promise<Positions> {
    return Promise.resolve([]);
  }
  public close(): Promise<Positions> {
    return Promise.resolve([]);
  }
}

type Transaction = {
  date: DateFormat;
  action: "open" | "close";
  position: Position;
  cash: number;
  invested: number;
  profit?: number;
};

type Journal = Array<Transaction>;

/** Summary value for a day */
type Valuation = {
  date: DateFormat;
  cash: number;
  invested: number;
  value: number;
};

/** Valuation day by day */
type Performance = Array<Valuation>;

/** Simulate trading over a period */
export class Simulation {
  private readonly journal: Journal = [];
  private readonly positions: Positions = [];
  private invested = 0;
  private readonly performance: Performance = [];

  constructor(
    private readonly start: DateFormat,
    private readonly end: DateFormat,
    private readonly community: Community,
    private readonly strategy: StrategyClass,
    private cash: number = 100000
  ) {
    //console.log(this.strategy);
  }

  /** By which amount is a position in profit */
  private profit(position: Position, _end: DateFormat): number {
    const amount = position.amount;
    // TODO
    //const gain = await position.investor.gain(position.date, end);
    const gain = 0;
    const profit = amount + amount * gain;
    return profit;
  }

  /** Calculate value of portfolio */
  private valuate(date: DateFormat): void {
    let invested = 0;
    this.positions.forEach((position: Position) => {
      const profit: number = this.profit(position, date);
      invested += position.amount + profit;
    });
    this.performance.push({
      date: date,
      cash: this.cash,
      invested: invested,
      value: this.cash + invested,
    });
  }

  // TODO
  /** Close any positions hitting limits */
  private limit(_date: DateFormat): void {}

  /** Add a new position */
  private open(date: DateFormat, position: Position): void {
    const amount = position.amount;
    this.invested += amount;
    this.cash -= amount;

    this.journal.push({
      date: date,
      action: "open",
      position: position,
      cash: this.cash,
      invested: this.invested,
    });
    this.positions.push(position);
  }

  /** Close all matching positions */
  private close(date: DateFormat, position: Position): void {
    const username = position.investor.UserName;
    this.positions.forEach((position: Position, index: number) => {
      if (position.investor.UserName == username) {
        const profit = this.profit(position, date);
        const amount = position.amount + profit;
        this.cash += amount;
        this.invested -= amount;

        this.journal.push({
          date: date,
          action: "close",
          position: position,
          cash: this.cash,
          invested: this.invested,
        });
      }
      this.positions.splice(index, 1);
    });
  }

  /** Open or close positions */
  private async trade(date: DateFormat): Promise<void> {
    const strategyClass = this.strategy;
    const strategy = new strategyClass(this.positions, this.community);
    (await strategy.open()).forEach((order) => this.open(date, order));
    (await strategy.close()).forEach((order) => this.close(date, order));
  }

  /** Run a trading session on a particlar date */
  private async step(date: DateFormat): Promise<void> {
    this.valuate(date);
    this.limit(date);
    await this.trade(date);
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

  /** Export daily performance as chart */
  public get chart(): ChartSeries {
    return new ChartSeries(
      this.performance.map((r) => r.value),
      this.start
    );
  }
}
