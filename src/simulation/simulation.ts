import { DateFormat, nextDate } from "/utils/time/mod.ts";
import { Community, Investor, ChartSeries, Names } from "/investor/mod.ts";
import { ObjectSeries } from "/utils/series.ts";

type Investors = ObjectSeries<Investor>;

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
    protected readonly positions: Positions,
    protected readonly investors: Investors,
    protected readonly date: DateFormat
  ) {}
  abstract open(): Promise<Positions>;
  abstract close(): Promise<Positions>;
}

interface StrategyClass {
  new (positions: Positions, investors: Investors, date: DateFormat): Strategy;
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

/** Always buy one random */
export class RandomStrategy extends Strategy {
  public async open(): Promise<Positions> {
    if (this.investors.length > 0) {
      const investor: Investor = this.investors.any;
      const amount = 1000;
      const date: DateFormat = this.date;
      const price: number = (await investor.chart()).value(this.date);
      const position: Position = { date, amount, investor, price };
      return [position];
    } else return [];
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
  positions: number;
  invested: number;
  cash: number;
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
  private async profit(position: Position, end: DateFormat): Promise<number> {
    const amount = position.amount;
    // TODO
    const gain = await position.investor.gain(position.date, end);
    //const gain = 0;
    const profit = amount * gain;
    return profit;
  }

  /** Calculate value of portfolio */
  private async valuate(date: DateFormat): Promise<void> {
    let invested = 0;
    for (const position of this.positions) {
      const profit: number = await this.profit(position, date);
      invested += position.amount + profit;
    }
    const positions: number = this.positions.length;
    const cash: number = this.cash;
    const value: number = cash + invested;
    this.performance.push({ date, positions, invested, cash, value });
  }

  // TODO
  /** Close any positions hitting limits */
  private async limit(date: DateFormat): Promise<void> {
    for (const position of [...this.positions]) {
      const end: DateFormat | null = await position.investor.end();
      if (end && end < date) {
        await this.close(nextDate(date, -1), position);
      }
    }
  }

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
    //console.log(date, this.invested, this.cash, position.investor.UserName);
    this.positions.push(position);
  }

  /** Close all matching positions */
  private async close(date: DateFormat, position: Position): Promise<void> {
    const username = position.investor.UserName;
    //console.log(`Closing ${username} on ${date}`);
    //this.positions.forEach(async (position: Position, index: number) => {
    for (let index = 0; index < this.positions.length; index++) {
      const position = this.positions[index];
      if (position.investor.UserName == username) {
        const profit = await this.profit(position, date);
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
        this.positions.splice(index, 1);
      }
    }
  }

  /** Open or close positions */
  private async trade(date: DateFormat): Promise<void> {
    const strategyClass = this.strategy;

    const names: Names = await this.community.active(date);
    //console.log({ date, names });
    const objects: Array<Investor> = await Promise.all(
      names.values.map((name) => this.community.investor(name))
    );
    const investors: Investors = new ObjectSeries(objects);
    const strategy = new strategyClass(this.positions, investors, date);
    const close = await strategy.close();
    for (const order of close) await this.close(date, order);
    const open = await strategy.open();
    for (const order of open) this.open(date, order);
  }

  /** Run a trading session on a particlar date */
  private async step(date: DateFormat): Promise<void> {
    await this.limit(date);
    await this.valuate(date);
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
