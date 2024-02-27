import type { DateFormat } from "📚/time/mod.ts";
import type { Investors } from "📚/repository/mod.ts";
import { DataFrame } from "📚/utils/dataframe.ts";
import { Portfolio } from "./portfolio.ts";

type UserName = string;
type RankScore = number;
type Conviction = Record<UserName, RankScore>;

export type IPolicy = {
  // List of investors available on date
  investors: Investors;

  // Portfolio of current positions
  portfolio: Portfolio;

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
  private readonly investors: Investors;
  private readonly portfolio: Portfolio;
  private readonly conviction: Conviction;
  private readonly date: DateFormat;
  private readonly cash: number;
  private readonly targets: number;

  constructor(params: IPolicy) {
    this.investors = params.investors;
    this.portfolio = params.portfolio;
    this.conviction = params.conviction;
    this.date = params.date;
    this.cash = params.cash;
    this.targets = params.targets;
  }

  /** Given investor ranks, available cash etc. what is target investment level */
  public get target(): Conviction {
    const candidates: Conviction = Object.fromEntries(
      Object.entries(this.conviction).filter(([_user, rank]) => rank > 0),
    );
    const records = Object.entries(candidates).map(([user, rank]) => ({
      UserName: user,
      Rank: rank,
    }));
    const df = DataFrame.fromRecords(records);
    df.scale("Rank", this.cash).log("Rank").distribute("Rank").scale(
      "Rank",
      this.cash,
    ).sort("Rank").reverse.print("Targets");
    return candidates;
  }
}
