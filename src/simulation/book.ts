import { DateFormat } from "/utils/time/mod.ts";
import { Position } from "./position.ts";
import { Portfolio } from "./portfolio.ts";
import { DataFrame } from "/utils/dataframe.ts";

type Deposit = {
  _type: 'Deposit',
  date: DateFormat;
  amount: number;
};

type Open = {
  _type: 'Open',
  date: DateFormat;
  position: Position;
  amount: number;
};

type Reasons = "sell" | "expire" | "limit";

type Close = {
  _type: 'Close',
  date: DateFormat;
  reason: Reasons;
  position: Position;
  amount: number;
  profit: number;
};

type Valuation = {
  _type: 'Valuation',
  date: DateFormat;
  invested: number;
  profit: number;
  balance: number;
  value: number;
};

type Transaction = Deposit | Open | Close | Valuation;

type TableRecord = {
  date: DateFormat;
  action: Reasons | "deposit" | "buy" | "value";
  investor: string;
  amount: number;
  invested: number;
  profit: number;
  balance: number;
  value: number;
};

export type Journal = Array<Transaction>;

/** A journal of transaction on portfolio */
export class Book {
  private readonly journal: Journal = [];
  public readonly portfolio = new Portfolio();
  private balance = 0;

  /** Increase cash balance */
  public deposit(amount: number, date: DateFormat): void {
    const transaction: Deposit = { date, amount, _type: 'Deposit' };
    this.journal.push(transaction);
    this.balance += amount;
  }

  /** Most recent transaction */
  private get last(): Transaction {
    return this.journal[this.journal.length - 1];
  }

  /** Current value */
  public get value(): number {
    const last: Transaction = this.last;
    const end: DateFormat = last.date;
    const value: number = this.balance + this.portfolio.value(end);
    return value;
  }

  /** Add position */
  public add(position: Position): boolean {
    const transaction: Open = {
      date: position.date,
      position: position,
      amount: position.amount,
      _type: 'Open'
    };
    this.portfolio.add(position);
    this.journal.push(transaction);
    this.balance -= position.amount;
    return true;
  }

  /** Remove position at date for reason */
  public remove(
    position: Position,
    date: DateFormat,
    reason: Reasons
  ): boolean {
    if (this.portfolio.remove(position)) {
      const amount = position.value(date);
      const profit = position.profit(date);
      const transaction: Close = { date, reason, position, amount, profit, _type: 'Close' };
      this.journal.push(transaction);
      this.balance += amount;
      return true;
    }
    return false;
  }

  /** Calculate value on date */
  public valuate(date: DateFormat): void {
    const profit: number = this.portfolio.profit(date);
    const value = this.portfolio.value(date);
    const invested = this.portfolio.invested;
    const balance = this.balance;
    const transaction: Valuation = { date, invested, value, profit, balance, _type: 'Valuation' };
    this.journal.push(transaction);
  }

  /** Export transactions as dataframe */
  public get export(): DataFrame {
    const records: Array<TableRecord> = [];
    for ( const transaction of this.journal ) {
      const record: TableRecord = (() => {
        switch(transaction._type) {
          case 'Deposit': return {
            date: transaction.date,
            action: "deposit",
            investor: '',
            amount: transaction.amount,
            invested: 0,
            profit: 0,
            balance: 0,
            value: 0
          };
          case 'Open': return {
            date: transaction.date,
            action: "buy",
            investor: transaction.position.name,
            amount: transaction.amount,
            invested: 0,
            profit: 0,
            balance: 0,
            value: 0
          };
          case 'Close': return {
            date: transaction.date,
            action: transaction.reason,
            investor: transaction.position.name,
            amount: parseFloat(transaction.amount.toFixed(2)),
            invested: 0,
            profit: parseFloat(transaction.profit.toFixed(2)),
            balance: 0,
            value: 0
          };
          case 'Valuation': return {
            date: transaction.date,
            action: "value",
            investor: '',
            amount: 0,
            invested: transaction.invested,
            profit: transaction.profit,
            balance: transaction.balance,
            value: transaction.value
          };
          default: return {
            date: '',
            action: "value",
            investor: '',
            amount: 0,
            invested: 0,
            profit: 0,
            balance: 0,
            value: 0
          };
        }
      })();
      records.push(record);
    }
    return DataFrame.fromRecords(records);
  }
}
