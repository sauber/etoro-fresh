import type { DateFormat } from "📚/time/mod.ts";
import type { Investors } from "📚/repository/mod.ts";
import { Chart } from "📚/chart/mod.ts";
import { DataFrame } from "📚/utils/dataframe.ts";
import type { RowRecord } from "📚/utils/dataframe.ts";
import { Portfolio } from "./portfolio.ts";
import { Position } from "./position.ts";
import { Order } from "./order.ts";
import type { SellItem } from "./order.ts";

type UserName = string;
type RankScore = number;
type Conviction = Record<UserName, RankScore>;

export type IPolicy = {
  // Portfolio of current positions
  portfolio: Portfolio;

  // Historical performance of portfolio
  chart: Chart;

  // List of investors available on date
  investors: Investors;

  // Investors rank
  conviction: Record<UserName, RankScore>;

  // On which date to apply policy
  date: DateFormat;

  // Cash available for spending
  cash: number;

  // Target number of positions of in portfolio
  targets: number;
};

export class Policy {
  private readonly portfolio: Portfolio;
  private readonly chart: Chart;
  private readonly investors: Investors;
  private readonly conviction: Conviction;
  private readonly date: DateFormat;
  private readonly cash: number;
  private readonly targets: number;

  constructor(params: IPolicy) {
    this.portfolio = params.portfolio;
    this.chart = params.chart;
    this.investors = params.investors;
    this.conviction = params.conviction;
    this.date = params.date;
    this.cash = params.cash;
    this.targets = params.targets;
  }

  /** Sum of cash and value of positions */
  // TODO: Cannot calculate value of expired positions
  private get value(): number {
    return this.cash + this.portfolio.value(this.date);
  }

  /** Identify expired positions from portfolio */
  private get expired(): Order {
    return new Order().sell(
      this.portfolio.positions.filter((position: Position) =>
        position.expired(this.date)
      ).map((position: Position) => ({
        position,
        reason: "expired",
      })),
    );
  }

  /** Identify positions which boxed hit limits from portfolio */
  private get limited(): Order {
    return new Order().sell(
      this.portfolio.positions.filter((position: Position) =>
        position.limited(this.date)
      ).map((position: Position) => ({
        position,
        reason: "limit",
      })),
    );
  }

  /** Positions that are neither expired nor hit limits */
  private get open(): Order {
    return new Order().sell(
      this.portfolio.positions.filter((position: Position) =>
        position.open(this.date)
      ).map((position: Position) => ({
        position,
        reason: "open",
      })),
    );
  }

  /** Given investor ranks, available cash etc. what is ideal target investment level for each investor */
  public get target(): DataFrame {
    // Ranked positively
    const desired: Conviction = Object.fromEntries(
      Object.entries(this.conviction).filter(([_user, rank]) => rank > 0),
    );

    // Desired level of desired investment
    const records = Object.entries(desired).map(([user, rank]) => ({
      UserName: user,
      Rank: rank,
    }));
    const df = DataFrame.fromRecords(records);
    const target = df.add("Rank", 2).log("Rank").distribute("Rank").scale(
      "Rank",
      this.value,
    );

    // Print results
    // df.sort("Rank").reverse.print("Targets");

    return target;
  }

  /** Gap =
   * Open positions no longer desired
   * Desired positions not in portfolio, or by less amount than desired
   */
  public get gap(): DataFrame {
    const targets: DataFrame = this.target;
    const portfolio: Order = this.open;
    console.log({targets, portfolio});

    // Target amount for each UserName
    const targetAmount: Record<string, number> = Object.fromEntries(
      targets.records.map((r: RowRecord) => [r.UserName, r.Rank]),
    );

    // Current amount for each UserName
    // TODO: If multiple positions by same name, add values
    const currentAmount: Record<string, number> = Object.fromEntries(
      portfolio.sellItems.map((p: SellItem) => [p.position.name, p.position.value(this.date)]),
    );

    // Positions no longer a target
    const excessive: Record<string, number> = Object.fromEntries(
      Object.entries(currentAmount).filter(([UserName, _value]) =>
        !(UserName in targetAmount)
      ),
    );

    console.log({ targetAmount, currentAmount, excessive });


    // Targets missing from positions
    //const missing = targets.records.filter((target: RowRecord) => ! (target.UserName in positionSizes));

    // // Targets larger than positions
    // const tooSmall = targets.records.filter((target: RowRecord) => ( target.UserName in positionSizes ) && (target.Rank > positionSizes[target.UserName]));

    return new DataFrame();
  }

  /** Run through steps of policy. Compile a list of buy and sell orders. */
  public run(): Order {
    const compiled = new Order();
    // Positions considered gone
    compiled.sell(this.expired.sellItems);
    compiled.sell(this.limited.sellItems);
    // Remaining open positions
    const open: Order = this.open;
    // Ideal portfolio based on current ranking
    const target: DataFrame = this.target;

    // Desired = ideal - open
    const gap = this.gap;
    // timing
    // close undesired
    // close desired, if necessary
    // buy desired as necessary
    // Resolve positions that are both sell and buy at the same time
    return compiled;
  }
}