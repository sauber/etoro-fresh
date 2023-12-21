import { DateFormat } from "/utils/time/mod.ts";
import { Position } from "./position.ts";
import { Portfolio } from "./portfolio.ts";
import { DataFrame } from "/utils/dataframe.ts";

type Reasons = "sell" | "expire" | "limit";
type Actions = "deposit" | "valuate" | "buy" | Reasons;

type Transaction = {
  date: DateFormat;
  action: Actions;
  name?: string;
  amount?: number;
  invested: number;
  profit: number;
  cash: number;
  value: number;
};

export type Journal = Array<Transaction>;

/** A journal of transaction on portfolio */
export class Book {
  private readonly journal: Journal = [];
  public readonly portfolio = new Portfolio();
  public readonly balance = {
    invested: 0,
    profit: 0,
    cash: 0,
    value: 0,
  };

  /** Increase cash balance */
  public deposit(date: DateFormat, amount: number): void {
    this.balance.cash += amount;
    this.balance.value += amount;
    this.journal.push({
      date,
      action: "deposit",
      name: "cash",
      amount,
      ...this.balance,
    });
  }

  /** Add position */
  public add(date: DateFormat, position: Position): boolean {
    // Add to portfolio
    this.portfolio.add(position);

    // Add to transactions
    const amount = position.amount;
    const name = position.name;
    this.balance.cash -= amount;
    this.balance.invested += amount;
    this.journal.push({ date, action: "buy", name, amount, ...this.balance });

    return true;
  }

  /** Remove position at date for reason */
  public remove(
    date: DateFormat,
    position: Position,
    action: Reasons,
    price: number
  ): boolean {
    if (this.portfolio.remove(position)) {
      // Adjust balance
      const profit: number = position.amount * (price / position.price - 1);
      const amount: number = position.amount + profit;
      this.balance.cash += amount;
      this.balance.invested -= position.amount;
      this.balance.profit += profit;
      this.balance.value += profit;

      // Add transaction
      const name = position.name;
      this.journal.push({
        date,
        action,
        name,
        amount,
        ...this.balance,
        profit,
      });
      return true;
    }
    return false;
  }

  /** Calculate value on date */
  public valuate(date: DateFormat): void {
    this.balance.invested = this.portfolio.invested;
    this.balance.profit = this.portfolio.profit(date);
    this.balance.value =
      this.balance.invested + this.balance.profit + this.balance.cash;
    this.journal.push({ date, action: "valuate", ...this.balance });
  }

  public get length(): number {
    return this.journal.length;
  }

  /** Export transactions as dataframe */
  public get export(): DataFrame {
    return DataFrame.fromRecords(this.journal);
  }
}
