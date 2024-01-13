import { InvestorObject } from "../storage/backend.ts";
export { repoBackend as rawBackend } from "../repository/old/testdata.ts";

export const investorData: InvestorObject = {
  UserName: "foo",
  CustomerId: 1,
  start: "2024-01-05",
  end: "2024-01-05",
  chart: [10000],
  stats: {
    "2024-01-05": {
      PopularInvestor: true,
      Gain: 1,
      RiskScore: 1,
      MaxDailyRiskScore: 1,
      MaxMonthlyRiskScore: 1,
      Copiers: 1,
      CopiersGain: 1,
      VirtualCopiers: 1,
      AUMTier: 1,
      AUMTierV2: 1,
      Trades: 1,
      WinRatio: 1,
      DailyDD: 1,
      WeeklyDD: 1,
      ProfitableWeeksPct: 1,
      ProfitableMonthsPct: 1,
      Velocity: 1,
      Exposure: 1,
      AvgPosSize: 1,
      HighLeveragePct: 1,
      MediumLeveragePct: 1,
      LowLeveragePct: 1,
      PeakToValley: 1,
      LongPosPct: 1,
      ActiveWeeks: 1,
      ActiveWeeksPct: 1,
      WeeksSinceRegistration: 1,
    },
  },
};
