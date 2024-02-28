/** An order contains biud and sell items that have not yet been executed */

import { Investor } from "📚/investor/mod.ts";
import type { DateFormat } from "../time/mod.ts";
import { Position } from "./position.ts";

type BuyItem = {
  investor: Investor;
  date: DateFormat;
  amount: number;
};
type BuyItems = Array<BuyItem>;

type SellItem = {
  position: Position;
  reason: string;
};
type SellItems = Array<SellItem>;

export class Order {
  readonly buyItems: BuyItems = [];
  readonly sellItems: SellItems = [];

  public buy(items: BuyItems): Order {
    this.buyItems.push(...items);
    return this;
  }

  public sell(items: SellItems): Order {
    this.sellItems.push(...items);
    return this;
  }
}
