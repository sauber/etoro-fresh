import { sprintf } from "printf";
import { assert } from "assert";
import { Downloadable } from "./asset.ts";
import { Repo } from "./repo.ts";
import { Investors } from "./investors.ts";

interface Position {
  InstrumentID: number;
  Direction: "Buy"|"Sell";
  Invested: number;
  NetProfit: number;
  Value: number;
}

interface InstrumentType {
  IndustryTypeID: number;
  Direction: "Buy"|"Sell";
  Invested: number;
  NetProfit: number;
  Value: number;
}

interface StockIndustry {
  StockIndustryID: number;
  Direction: "Buy"|"Sell";
  Invested: number;
  NetProfit: number;
  Value: number;
}

interface MirrorData {
  MirrorID: number;
  ParentCID: number;
  ParentUsername: string;
  Invested: number;
  NetProfit: number;
  Value: number;
  PendingForClosure: boolean;
}

export interface PortfolioData {
  CreditByRealizedEquity: number;
  CreditByUnrealizedEquity: number;
  AggregatedMirrors: MirrorData[];
  AggregatedPositions: Position[];
  AggregatedPositionsByInstrumentTypeID: InstrumentType[];
  AggregatedPositionsByStockIndustryID: StockIndustry[];
}

export class Portfolio extends Downloadable<PortfolioData> {
  protected readonly filename: string;
  private static readonly urlTemplate =
    "https://www.etoro.com/sapi/trade-data-real/live/public/portfolios?cid=%d&client_request_id=%s";
  protected readonly expire = 40000; // Max age in miutes

  constructor(
    protected readonly repo: Repo,
    private readonly username: string,
    private readonly cis: number
  ) {
    super(repo);
    this.filename = `${username}.portfolio.json`;
  }

  protected async url(): Promise<string> {
     return sprintf(Portfolio.urlTemplate, this.cis, await this.uuid())
  }

  protected validate(data: PortfolioData): boolean {
    assert(data.CreditByRealizedEquity >= 0, `Portfolio CreditByRealizedEquity is ${data.CreditByRealizedEquity}`);
    return true;
  }

  async mirrors(): Promise<Investors> {
    const data = await this.recent();
    const investors = new Investors(this.repo);
    for ( const investor of data.AggregatedMirrors) {
      investors.add(investor.ParentUsername, investor.ParentCID);
    }
    return investors;
  }
}
