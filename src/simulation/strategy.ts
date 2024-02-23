/**
 * Strategy takes at initialization a list of investors and the book.
 * The open() method is called with a list of orders from previous strategies.
 * Orders can be extended, trimmed or changed (amount).
 * It returns the new list of orders.
 * The close() method is called with a list of positions from previous strategies.
 * Positions can be trimmed.
 * It returns the new list os positions to close.
 * Strategies can be chained.
 * 
 * Example:
 *   const roll = new Strategy(investors, book)
 *     .weekday('monday')
 *     .unbox
 *     .positions(40)
 *     .crosspath(20,50);
 * 
 *   positions = roll.close(book.positions);
 *   positions.forEach(p => p.close());
 * 
 *   orders = roll.open();
 *   orders.forEach(o => o.open());
 */


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
