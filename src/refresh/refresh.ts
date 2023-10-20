import {
  RepoBackend,
  
  JSONObject,
} from "/repository/mod.ts";
import { Fetch } from "./fetch.ts";
import { FetchBackend } from "./mod.ts";
import { Discover, DiscoverData } from "/discover/mod.ts";
import type { DiscoverParams } from "/discover/mod.ts";
import { Portfolio, PortfolioData } from "/investor/mod.ts";
import type { InvestorId } from "/investor/mod.ts";
import { Chart, ChartData } from "/investor/mod.ts";
import { today } from "/utils/time/mod.ts";
import { assert } from "assert";

/** Load all data for all investors */
export class Refresh {
  private readonly fetch: Fetch;

  // TODO: Read from config
  // Convert hours to ms
  private static msPerHour = 60 * 60 * 1000;
  private readonly expire = {
    mirror: 16 * Refresh.msPerHour,
    discover: 50 * Refresh.msPerHour,
    chart: 24 * Refresh.msPerHour,
    portfolio: 666 * Refresh.msPerHour,
    stats: 333 * Refresh.msPerHour,
  };

  // How many external fetches are performed
  private fetchCount = 0;

  constructor(
    private readonly repo: RepoBackend,
    private readonly fetcher: FetchBackend,
    private readonly investor: InvestorId,
    private readonly filter: DiscoverParams
  ) {
    this.fetch = new Fetch(fetcher);
  }

  /** Load  asset from web if missing or expired */
  private async recent(
    assetname: string,
    expire: number,
    web: () => Promise<JSONObject>,
    validate?: (data: JSONObject) => boolean,
  ): Promise<boolean> {
    // Check age
    const age: number | null = await this.repo.age(assetname);
    if ( age && age < expire ) return true;

    // Load from web
    console.log(`Loading ${assetname} from web`);
    const data: JSONObject = await web();
    ++this.fetchCount;
    if ( validate && ! validate(data) ) {
      console.warn(`Warning: Asset ${assetname} failed validation`);
      return false;
    }
    await this.repo.store(assetname, data);
    return true;
  }

  /** Load investor ID's from discovery */
  private async discover(): Promise<InvestorId[]> {
    const validate = function (loaded: JSONObject) {
      const discover: Discover = new Discover(loaded as DiscoverData);
      const count: number = discover.count;
      // TODO: Use config values
      assert( count >= 70 && count <= 140, `Count of discovered investors is ${count}, should be 70-140`);
      return true;
    }
  
    // TODO: Validate data
    const available: boolean = (await this.recent(
      "discover", 
      this.expire.discover, 
      () => this.fetch.discover(this.filter),
      validate
    ));
    if ( available ) {
      const data = await this.repo.retrieve("discover") as DiscoverData;
      const discover: Discover = new Discover(data);
      const investors: InvestorId[] = discover.investors;
      return investors;
    } else {
      return [];
    }
  }

  private chart(investor: InvestorId): Promise<boolean> {
    const validate = function (loaded: JSONObject) {
      const chart: Chart = new Chart(loaded as ChartData);
      if ( ! chart.validate ) {
        console.warn(`Warning: Chart for ${investor.UserName} is invalid`);
        return false;
      }
      if ( chart.end != today() ) {
        console.warn(`Warning: ${investor.UserName} chart end ${chart.end} is not today`);
        return false;
      }
      return true;
    }

    return this.recent(
      investor.UserName + ".chart",
      this.expire.chart,
      () => this.fetch.chart(investor),
      validate
    );
  }

  private portfolio(investor: InvestorId, expire: number = this.expire.portfolio): Promise<boolean> {
    return this.recent(
      investor.UserName + ".portfolio",
      expire,
      () => this.fetch.portfolio(investor)
    );
  }

  private stats(investor: InvestorId): Promise<boolean> {
    return this.recent(
      investor.UserName + ".stats",
      this.expire.stats,
      () => this.fetch.stats(investor)
    );
  }

  private loadInvestor(investor: InvestorId): Promise<boolean[]> {
    return Promise.all([
      this.chart(investor),
      this.portfolio(investor),
      this.stats(investor),
    ]);
  }

  private async mirrors(): Promise<InvestorId[]> {
    await this.chart(this.investor);
    await this.stats(this.investor);
    if (await this.portfolio(this.investor, this.expire.mirror)) {
      const data = await this.repo.retrieve(this.investor.UserName + '.portfolio') as PortfolioData;
      const portfolio: Portfolio = new Portfolio(data);
      const investors: InvestorId[] = portfolio.investors();
      return investors;
    } else {
      return [];
    }
  }

  public async run(max?: number): Promise<number> {
    const investors = [...(await this.mirrors()), ...(await this.discover())];
    const subset = max ? investors.slice(0, max) : investors;

    // Run in parallel
    await Promise.all(
      subset.map((investor: InvestorId) => this.loadInvestor(investor))
      //subset.map((investor: InvestorId) => {
      //  console.log(investor.UserName, investor.CustomerId);
      //  return this.loadInvestor(investor);
      //})
    );

    return this.fetchCount;
  }
}
