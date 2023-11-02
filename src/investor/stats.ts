import { assert } from "assert";
import { InvestorId } from "./mod.ts";

export type StatsExport = Record<
  string,
  string | number | boolean | Array<number>
>;

export type StatsData = {
  Data: {
    CustomerId: number;
    UserName: string;
    PopularInvestor: boolean;
    Gain: number;
    RiskScore: number;
    MaxDailyRiskScore: number;
    MaxMonthlyRiskScore: number;
    Copiers: number;
    CopiersGain: number;
    VirtualCopiers: number;
    AUMTier: number;
    AUMTierV2: number;
    Trades: number;
    WinRatio: number;
    DailyDD: number;
    WeeklyDD: number;
    ProfitableWeeksPct: number;
    ProfitableMonthsPct: number;
    Velocity: number;
    Exposure: number;
    AvgPosSize: number;
    HighLeveragePct: number;
    MediumLeveragePct: number;
    LowLeveragePct: number;
    PeakToValley: number;
    LongPosPct: number;
    ActiveWeeks: number;
    ActiveWeeksPct: number;
    WeeksSinceRegistration: number;
  };
}

export class Stats {
  constructor(private readonly raw: StatsData) {}

  /** Confirm stats include CustomerId */
  public validate(): boolean {
    assert(this.raw.Data.CustomerId, `CustomerId missing`);
    return true;
  }

  /** Export essential data */
  public export(): StatsExport {
    return this.raw.Data;
  }
}
