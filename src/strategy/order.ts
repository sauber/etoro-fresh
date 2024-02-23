/** An order contains biud and sell items that have not yet been executed */

import { Investor } from "📚/investor/mod.ts";
import type { DateFormat } from "📚/utils/time/mod.ts";
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
  readonly buy: BuyItems = [];
  readonly sell: SellItems = [];
}
