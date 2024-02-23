export type { Investors } from "📚/repository/mod.ts";
import { Investor } from "📚/investor/mod.ts";
import type { DateFormat } from "📚/utils/time/mod.ts";
import type { Investors } from "📚/repository/mod.ts";

type Order = {
  investor: Investor;
  action: "buy" | "sell" | "keep";
  amount: number;
  reason?: string;
  value?: number;
  rank?: number;
  timing?: number;
};

export type Orders = Array<Order>;

/** Pick a random item from an array */
function any<T>(items: Array<T>): T {
  const count = items.length;
  const index = Math.floor(Math.random() * count);
  return items[index];
}

export class Strategy {
  constructor(
    protected readonly investors: Investors,
    protected readonly parent?: Strategy,
  ) {}

  /** List of buy, sell and keep orders */
  public orders(_date: DateFormat): Orders {
    if (this.parent) return this.parent.orders(_date);
    else return [];
  }

  public get null(): NullStrategy {
    return new NullStrategy(this.investors, this);
  }

  public random(amount: number): RandomStrategy {
    return new RandomStrategy(this.investors, amount, this);
  }
}

//////////////////////////////////////////////////////////////////////
/// Strategies
//////////////////////////////////////////////////////////////////////

/** No change to orders */
export class NullStrategy extends Strategy {}

/** Always buy one random, never sell */
export class RandomStrategy extends Strategy {
  constructor(
    protected readonly investors: Investors,
    private amount: number,
    protected readonly parent?: Strategy,
  ) {
    super(investors, parent);
  }

  public orders(_date: DateFormat): Orders {
    const orders = this.parent?.orders(_date) || [];
    if (this.investors.length > 0) {
      const investor: Investor = any(this.investors);
      const amount = 1000;
      orders.push({ investor, amount, action: "buy" });
    }
    return orders;
  }
}
