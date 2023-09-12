import { sprintf } from "printf";
import { assert } from "assert";
import { Files } from "./files.ts";
import { Asset } from "./asset.ts";
import { Repo } from "./repo.ts";

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

export interface PortfolioData {
  CreditByRealizedEquity: number;
  CreditByUnrealizedEquity: number;
  AggregatedMirrors: Record<string, string | never>[];
  AggregatedPositions: Position[];
  AggregatedPositionsByInstrumentTypeID: InstrumentType[];
  AggregatedPositionsByStockIndustryID: StockIndustry[];
}

export class Portfolio extends Asset<PortfolioData> {
  readonly filename: string;
  static readonly url =
    "https://www.etoro.com/sapi/trade-data-real/live/public/portfolios?cid=%d&client_request_id=%s";
  static readonly expire = 3000; // Max age in miutes

  constructor(
    protected readonly repo: Repo,
    private readonly name: string,
    private readonly cis: number
  ) {
    super(repo);
    this.filename = `${name}.portfolio.json`;
  }

  async download(): Promise<PortfolioData> {
    const uuid = await this.repo.uuid.recent();
    console.log(Portfolio.url);
    console.log(uuid, this.cis);
    const url = sprintf(Portfolio.url, this.cis, uuid);
    console.log(url);

    const fs: Files = this.repo.files;
    const content: string = await fs.download(url);
    const data = JSON.parse(content) as PortfolioData;
    return data;
  }

  private validate(data: PortfolioData): boolean {
    assert(data.CreditByRealizedEquity > 70);
    return true;
  }

  async recent(): Promise<PortfolioData> {
    const files = this.repo.files;
    const age = await files.age(this.filename);
    if (!age || age > Portfolio.expire) {
      const data: PortfolioData = await this.download();
      files.write(this.filename, JSON.stringify(data));
      return data;
    } else {
      const data = await this.latest();
      if (data) return data as PortfolioData;
    }
    throw new Error("Portfolio file not downloaded");
  }
}
