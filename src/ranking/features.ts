import { DateFormat } from "../time/mod.ts";
import { Investor } from "/investor/mod.ts";
import type { StatsExport } from "📚/repository/mod.ts";
import { Chart } from "📚/chart/mod.ts";

export type Input = {
  PopularInvestor: number;
  Gain: number;
  RiskScore: number;
  MaxDailyRiskScore: number;
  MaxMonthlyRiskScore: number;
  Copiers: number;
  CopiersGain: number;
  AUMTier: number;
  AUMTierV2: number;
  VirtualCopiers: number;
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

/** Names of fields from stats that are suitable for training */
const props = [
  "PopularInvestor", "Gain", "RiskScore", "MaxDailyRiskScore",
  "MaxMonthlyRiskScore", "Copiers", "CopiersGain", "AUMTier",
  "AUMTierV2", "Trades", "WinRatio", "DailyDD", "WeeklyDD",
  "ProfitableWeeksPct", "ProfitableMonthsPct", "Velocity",
  "Exposure", "AvgPosSize", "HighLeveragePct", "MediumLeveragePct",
  "LowLeveragePct", "PeakToValley", "LongPosPct", "ActiveWeeks",
  "ActiveWeeksPct", "WeeksSinceRegistration"
] as const;

export type Output = {
  SharpeRatio: number;
  Profit: number;
};

export class Features {
  constructor(private readonly investor: Investor) {}

  /** Prediction input parameters */
  public input(date?: DateFormat): Input {
    const v: StatsExport = date ? this.investor.stats.before(date) : this.investor.stats.first;
    const extract = Object.fromEntries(props.map(key => [key, Number(v[key])])) as Input;
    return extract;
  }

  /** Prediction output parameters */
  public get output(): Output {
    const start: DateFormat = this.investor.stats.start;
    const chart: Chart = this.investor.chart.from(start);
    const apy: number = chart.apy;
    // 5% is annual money market return. 
    // TODO: Load from config
    const sr: number = chart.sharpeRatio(0.05);
    if (!Number.isFinite(sr)) {
      console.log({ chart, start, apy, sr });
      throw new Error("Invalid SharpeRatio");
    }
    const features: Output = {
      Profit: apy,
      SharpeRatio: sr,
    };
    return features;
  }
}
