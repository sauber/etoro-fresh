import { RepoBackend } from "/repository/mod.ts";
import type { JSONObject } from "/repository/mod.ts";
import { FetchBackend } from "./mod.ts";
import type { DiscoverFilter } from "./mod.ts";
import { Discover } from "/discover/mod.ts";
import type { DiscoverData } from "/discover/mod.ts";
import { Chart, Portfolio } from "/investor/mod.ts";
import type { InvestorId, ChartData, PortfolioData } from "/investor/mod.ts";
import { today } from "/utils/time/mod.ts";
import { assert } from "assert";

type Range = {
  min: number;
  max: number;
};

type Expire = {
  mirror: number;
  discover: number;
  chart: number;
  portfolio: number;
  stats: number;
}

// Convert hours to ms
const msPerHour = 60 * 60 * 1000;

/** Load all data for all investors */
export class Refresh {
  private readonly discover_count = {
      min: 70, max: 140
    } as Range;
   private readonly expire = {
      mirror: 16 * msPerHour,
      discover: 50 * msPerHour,
      chart: 24 * msPerHour,
      portfolio: 666 * msPerHour,
      stats: 333 * msPerHour,
    } as Expire;

  // How many external fetches are performed
  private fetchCount = 0;

  constructor(
    private readonly repo: RepoBackend,
    private readonly fetcher: FetchBackend,
    private readonly investor: InvestorId,
    private readonly filter: DiscoverFilter,
    // TODO: Expire
    // TODO: Discover Range
  ) {  }

  /** Load  asset from web if missing or expired */
  private async recent(
    assetname: string,
    expire: number,
    download: () => Promise<JSONObject>,
    validate?: (data: JSONObject) => boolean,
  ): Promise<boolean> {
    // Skip if not expired in repo
    const age: number | null = await this.repo.age(assetname);
    if ( age && age < expire ) return true;

    // Load from web
    //console.log(`Loading ${assetname} from web`);
    const data: JSONObject = await download();
    ++this.fetchCount;

    // Validate
    if ( validate && ! validate(data) ) {
      console.warn(`Warning: Asset ${assetname} failed validation`);
      return false;
    }

    // Store downloaded data
    await this.repo.store(assetname, data);
    return true;
  }

  /** Load list of investor ID's from discovery */
  private async discover(): Promise<InvestorId[]> {
    const range: Range = this.discover_count;
    const validate = function (loaded: JSONObject) {
      const discover: Discover = new Discover(loaded as DiscoverData);
      const count: number = discover.count;
      assert( count >= range.min && count <= range.max, `Count of discovered investors is ${count}, should be ${range.min}-${range.max}`);
      return true;
    }
  
    // TODO: Validate data
    const expire: Expire = this.expire;
    const available: boolean = (await this.recent(
      "discover", 
      expire.discover, 
      () => this.fetcher.discover(this.filter),
      validate
    ));
    if ( available ) {
      const data = await this.repo.retrieve("discover") as DiscoverData;
      const discover: Discover = new Discover(data);
      return discover.investors;
    } else {
      return [];
    }
  }

  private async chart(investor: InvestorId): Promise<boolean> {
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
      () => this.fetcher.chart(investor),
      validate
    );
  }

  private portfolio(investor: InvestorId, expire: number): Promise<boolean> {
    return this.recent(
      investor.UserName + ".portfolio",
      expire,
      () => this.fetcher.portfolio(investor)
    );
  }

  private stats(investor: InvestorId): Promise<boolean> {
    return this.recent(
      investor.UserName + ".stats",
      this.expire.stats,
      () => this.fetcher.stats(investor)
    );
  }

  private loadInvestor(investor: InvestorId, expire: number = this.expire.portfolio): Promise<boolean[]> {
    return Promise.all([
      this.chart(investor),
      this.portfolio(investor, expire),
      this.stats(investor),
    ]);
  }

  private async mirrors(): Promise<InvestorId[]> {
    await this.loadInvestor(this.investor, this.expire.mirror);
    const data = await this.repo.retrieve(this.investor.UserName + '.portfolio') as PortfolioData;
    const portfolio: Portfolio = new Portfolio(data);
    return portfolio.investors();
  }



  public async run(max?: number): Promise<number> {
    function onlyUnique(value: InvestorId, index: number, self: InvestorId[]) { 
      return index === self.findIndex((elem: InvestorId) => elem.UserName === value.UserName);
    }

    const investors: InvestorId[] = [...(await this.mirrors()), ...(await this.discover())];
    const subset: InvestorId[] = max ? investors.slice(0, max) : investors;
    const uniq: InvestorId[] = subset.filter(onlyUnique);

    // Run in parallel
    await Promise.all(
      uniq.map((investor: InvestorId) => this.loadInvestor(investor))
    );

    return this.fetchCount;
  }
}
