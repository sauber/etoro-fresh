import type { Investors } from "./mod.ts";
import { Portfolio } from "./portfolio.ts";
import type { Positions } from "./portfolio.ts";

type Order = {
  name: string;
  amount: number;
};

export type Orders = Array<Order>;

export abstract class Strategy {
  constructor(
    protected readonly portfolio: Portfolio,
    protected readonly investors: Investors,
  ) {}
  abstract open(): Promise<Orders>;
  abstract close(): Promise<Positions>;
}

export interface StrategyClass {
  new (portfolio: Portfolio, investors: Investors): Strategy;
}

/** Never buy, never sell */
export class NullStrategy extends Strategy {
  public open(): Promise<Orders> {
    return Promise.resolve([]);
  }
  public close(): Promise<Positions> {
    return Promise.resolve([]);
  }
}

/** Always buy one random, never sell */
export class RandomStrategy extends Strategy {
  public open(): Promise<Orders> {
    if (this.investors.length > 0) {
      const name: string = this.investors.any.UserName;
      const amount = 1000;
      return Promise.resolve([{ name, amount }]);
    } else return Promise.resolve([]);
  }
  public close(): Promise<Positions> {
    return Promise.resolve([]);
  }
}
