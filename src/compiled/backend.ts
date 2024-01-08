import { DateFormat } from "📚/utils/time/mod.ts";
import { Names } from "📚/investor/mod.ts";

export type InvestorStats = {
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

export type InvestorObject = {
  UserName: string;
  CustomerId: number;
  start: DateFormat;
  end: DateFormat;
  chart: number[];
  stats: Record<DateFormat, InvestorStats>;
};

export abstract class Backend {
  /** Delete whole repo */
  abstract delete(): Promise<void>;

  /** Verify if investor exists */
  abstract has(UserName: string): Promise<boolean>;

  /** Store an investor object */
  abstract store(data: InvestorObject): Promise<void>;

  /** Load investor Object */
  abstract retrieve(UserName: string): Promise<InvestorObject>;

   /** List of investor usernames */
   abstract names(): Promise<Names>;
}