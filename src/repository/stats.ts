export type StatsExport = {
  PopularInvestor: boolean;
  Gain: number;
  RiskScore: number;
  MaxDailyRiskScore: number;
  MaxMonthlyRiskScore: number;
  Copiers: number;
  CopiersGain: number;
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

export type StatsImport = StatsExport & {
  CustomerId: number;
  UserName: string;
  DisplayFullName: boolean;
  FullName?: string;
  VirtualCopiers: number;
};

export type StatsData = {
  Data: StatsImport;
};

/** Stats data scraped from eToro */
export class Stats {
  constructor(private readonly raw: StatsData) {}

  /** Confirm stats include CustomerId */
  public validate(): boolean {
    if (!this.raw.Data.CustomerId) throw new Error(`CustomerId missing`);
    return true;
  }

  /** Export subset of data */
  public get value(): StatsExport {
    const d = this.raw.Data;
    return {
      PopularInvestor: d.PopularInvestor,
      Gain: d.Gain,
      RiskScore: d.RiskScore,
      MaxDailyRiskScore: d.MaxDailyRiskScore,
      MaxMonthlyRiskScore: d.MaxMonthlyRiskScore,
      Copiers: d.Copiers,
      CopiersGain: d.CopiersGain,
      AUMTier: d.AUMTier,
      AUMTierV2: d.AUMTierV2,
      Trades: d.Trades,
      WinRatio: d.WinRatio,
      DailyDD: d.DailyDD,
      WeeklyDD: d.WeeklyDD,
      ProfitableWeeksPct: d.ProfitableWeeksPct,
      ProfitableMonthsPct: d.ProfitableMonthsPct,
      Velocity: d.Velocity,
      Exposure: d.Exposure,
      AvgPosSize: d.AvgPosSize,
      HighLeveragePct: d.HighLeveragePct,
      MediumLeveragePct: d.MediumLeveragePct,
      LowLeveragePct: d.LowLeveragePct,
      PeakToValley: d.PeakToValley,
      LongPosPct: d.LongPosPct,
      ActiveWeeks: d.ActiveWeeks,
      ActiveWeeksPct: d.ActiveWeeksPct,
      WeeksSinceRegistration: d.WeeksSinceRegistration,
    };
  }
}
