import { DateFormat, nextDate } from "/utils/time/mod.ts";
import { Community, Investor } from "/investor/mod.ts";

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

// export abstract class Strategy {
//   constructor(
//     protected readonly positions: Positions,
//     protected readonly community: Community
//   ) {}

//   /** Generate list of existing positions to close */
//   abstract close(): Positions;

//   /** Generate list of new orders to open */
//   abstract open(): Positions;
// }

interface Strategy {
  open(): Positions;
  close(): Positions;
}

interface StrategyConstructor {
  new (positions: Positions, community: Community): Strategy;
}

/*
const StrategyFactory = (
  cstra: StrategyConstructor,
  positions: Positions,
  community: Community
) => { return new cstra(positions, community) }
*/

export class NullStrategy implements Strategy {
  constructor(
    private readonly positions: Positions,
    private readonly community: Community
  ) {}
  open(): Positions {
    return [];
  }
  close(): Positions {
    return [];
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
  cash: number;
  invested: number;
  value: number;
};

/** Valuation day by day */
type Performance = Record<DateFormat, Valuation>;

/** Simulate trading over a period */
export class Simulation {
  private readonly journal: Journal = [];
  private readonly positions: Positions = [];
  private invested = 0;
  private readonly performance: Performance = {};

  constructor(
    private readonly start: DateFormat,
    private readonly end: DateFormat,
    private readonly community: Community,
    private readonly strategy: StrategyConstructor,
    private cash: number = 100000
  ) {
    //console.log(this.strategy);
  }

  /** By which amount is a position in profit */
  private profit(position: Position, _end: DateFormat): number {
    const amount = position.amount;
    // TODO
    //const gain = position.investor.gain(position.date, end);
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
    this.performance[date] = {
      cash: this.cash,
      invested: invested,
      value: this.cash + invested,
    };
  }

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
  private trade(date: DateFormat): void {
    const strategyClass = this.strategy;
    const strategy = new strategyClass(this.positions, this.community);
    //console.log(strategyClass, strategy);
    strategy.open().forEach((order) => this.open(date, order));
    strategy.close().forEach((order) => this.close(date, order));
  }

  /** Run a trading session on a particlar date */
  private step(date: DateFormat): void {
    this.valuate(date);
    this.limit(date);
    this.trade(date);
  }

  /** Run a trading sesssion each day in period */
  public run(): void {
    let date = this.start;
    while (date <= this.end) {
      //console.log(date);
      this.step(date);
      date = nextDate(date);
    }
  }

  /** Overall summary */
  public get gain(): number {
    const first: number = this.performance[this.start].value;
    const last: number = this.performance[this.end].value;
    const ratio: number = last / first - 1;
    return ratio;
  }
}
