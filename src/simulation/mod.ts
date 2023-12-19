import { DateFormat } from "/utils/time/mod.ts";
import { Investor } from "/investor/mod.ts";
import { ObjectSeries } from "/utils/series.ts";

export * from "./simulation.ts";

export type Investors = ObjectSeries<Investor>;

// export type Position = {
//   date: DateFormat;
//   investor: Investor;
//   amount: number;
//   price: number;
//   takeprofit?: number;
//   stoploss?: number;
//   trailing?: boolean;
//   days_min?: number;
//   days_max?: number;
// };

// export type Positions = Array<Position>;

// type Transaction = {
//   date: DateFormat;
//   action: "open" | "close";
//   position: Position;
//   cash: number;
//   invested: number;
//   profit?: number;
// };

// export type Journal = Array<Transaction>;

/** Summary value for a day */
type Valuation = {
  date: DateFormat;
  positions: number;
  invested: number;
  cash: number;
  value: number;
};

/** Valuation day by day */
export type Performance = Array<Valuation>;
