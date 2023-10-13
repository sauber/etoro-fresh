import { assert } from "assert";
import { InvestorId } from "./repo.d.ts";

type Position = {
  InstrumentID: number;
  Direction: "Buy"|"Sell";
  Invested: number;
  NetProfit: number;
  Value: number;
}

type InstrumentType = {
  IndustryTypeID: number;
  Direction: "Buy"|"Sell";
  Invested: number;
  NetProfit: number;
  Value: number;
}

type StockIndustry = {
  StockIndustryID: number;
  Direction: "Buy"|"Sell";
  Invested: number;
  NetProfit: number;
  Value: number;
}

type MirrorData = {
  MirrorID: number;
  ParentCID: number;
  ParentUsername: string;
  Invested: number;
  NetProfit: number;
  Value: number;
  PendingForClosure: boolean;
}

export type PortfolioData = {
  CreditByRealizedEquity: number;
  CreditByUnrealizedEquity: number;
  AggregatedMirrors: MirrorData[];
  AggregatedPositions: Position[];
  AggregatedPositionsByInstrumentTypeID: InstrumentType[];
  AggregatedPositionsByStockIndustryID: StockIndustry[];
}

export class Portfolio {
  constructor(private readonly raw: PortfolioData) {}

  public validate(): boolean {
    assert(this.raw.CreditByRealizedEquity >= 0, `Portfolio CreditByRealizedEquity is ${this.raw.CreditByRealizedEquity}`);
    return true;
  }

  public investors(): InvestorId[] {
    return this.raw.AggregatedMirrors.map((investor) => {return {UserName: investor.ParentUsername, CustomerId: investor.ParentCID}});
  }
}
