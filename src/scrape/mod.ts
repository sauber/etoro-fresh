import type { JSONObject } from "/repository/mod.ts";

export interface FetchBackend {
  /** Search for investors matching criteria */
  discover(filter: DiscoverFilter): Promise<JSONObject>;

  /** Fetch a chart object for investor  */
  chart(investor: InvestorId): Promise<JSONObject>;

  /** Fetch list of investments for investor  */
  portfolio(investor: InvestorId): Promise<JSONObject>;

  /** Fetch stats of investor  */
  stats(investor: InvestorId): Promise<JSONObject>;
}

////////////////////////////////////////////////////////////////////////
// Discover
////////////////////////////////////////////////////////////////////////

export type DiscoverFilter = {
  risk: number;
  daily: number;
  weekly: number;
};

export type InvestorId = {
  UserName: string;
  CustomerId: number;
};

export type DiscoverData = {
  Status: string;
  TotalRows: number;
  Items: InvestorId[];
};

////////////////////////////////////////////////////////////////////////
// Chart
////////////////////////////////////////////////////////////////////////

type ChartEntry = {
  timestamp: string;
  credit: number;
  investment: number;
  pnL: number;
  equity: number;
  totalDividends: number;
};

export type ChartData = {
  simulation: {
    oneYearAgo: {
      chart: ChartEntry[];
    };
  };
};

////////////////////////////////////////////////////////////////////////
// Position
////////////////////////////////////////////////////////////////////////

type Position = {
  InstrumentID: number;
  Direction: "Buy" | "Sell";
  Invested: number;
  NetProfit: number;
  Value: number;
};

type InstrumentType = {
  IndustryTypeID: number;
  Direction: "Buy" | "Sell";
  Invested: number;
  NetProfit: number;
  Value: number;
};

type StockIndustry = {
  StockIndustryID: number;
  Direction: "Buy" | "Sell";
  Invested: number;
  NetProfit: number;
  Value: number;
};

type MirrorData = {
  MirrorID: number;
  ParentCID: number;
  ParentUsername: string;
  Invested: number;
  NetProfit: number;
  Value: number;
  PendingForClosure: boolean;
};

export type PortfolioData = {
  CreditByRealizedEquity: number;
  CreditByUnrealizedEquity: number;
  AggregatedMirrors: MirrorData[];
  AggregatedPositions: Position[];
  AggregatedPositionsByInstrumentTypeID: InstrumentType[];
  AggregatedPositionsByStockIndustryID: StockIndustry[];
};

////////////////////////////////////////////////////////////////////////
// Stats
////////////////////////////////////////////////////////////////////////

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
};
