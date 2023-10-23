import { RepoBackend, JSONObject, Config } from "/repository/mod.ts";
import { Fetch } from "./fetch.ts";
import { FetchBackend } from "./mod.ts";
import { Discover, DiscoverData } from "/discover/mod.ts";
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

/** Load all data for all investors */
export class Refresh {
  private readonly fetch: Fetch;

  // Convert hours to ms
  private static msPerHour = 60 * 60 * 1000;

  private static defaults = {
    discover_count: {
      min: 70, max: 140
    } as Range,
    expire: {
      mirror: 16 * Refresh.msPerHour,
      discover: 50 * Refresh.msPerHour,
      chart: 24 * Refresh.msPerHour,
      portfolio: 666 * Refresh.msPerHour,
      stats: 333 * Refresh.msPerHour,
    } as Expire
  };

  // How many external fetches are performed
  private fetchCount = 0;
  private readonly config: Config;

  constructor(
    private readonly repo: RepoBackend,
    fetcher: FetchBackend,
    config: Config,
  ) {
    this.fetch = new Fetch(fetcher);
    this.config = config.withDefaults(Refresh.defaults);
  }

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
    const range = await this.config.get('discover_count') as Range;
    const validate = function (loaded: JSONObject) {
      const discover: Discover = new Discover(loaded as DiscoverData);
      const count: number = discover.count;
      assert( count >= range.min && count <= range.max, `Count of discovered investors is ${count}, should be ${range.min}-${range.max}`);
      return true;
    }
  
    // TODO: Validate data
    const expire = await this.config.get('expire') as Expire;
    const available: boolean = (await this.recent(
      "discover", 
      expire.discover, 
      () => this.fetch.discover(),
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

    const expire = await this.config.get('expire') as Expire;

    return this.recent(
      investor.UserName + ".chart",
      expire.chart,
      () => this.fetch.chart(investor),
      validate
    );
  }

  private portfolio(investor: InvestorId, expire: number): Promise<boolean> {
    return this.recent(
      investor.UserName + ".portfolio",
      expire,
      () => this.fetch.portfolio(investor)
    );
  }

  private async stats(investor: InvestorId): Promise<boolean> {
    const expire = await this.config.get('expire') as Expire;
    return this.recent(
      investor.UserName + ".stats",
      expire.stats,
      () => this.fetch.stats(investor)
    );
  }

  private async loadInvestor(investor: InvestorId): Promise<boolean[]> {
    const expire = await this.config.get('expire') as Expire;
    return Promise.all([
      this.chart(investor),
      this.portfolio(investor, expire.portfolio),
      this.stats(investor),
    ]);
  }

  private async mirrors(): Promise<InvestorId[]> {
    const expire = await this.config.get('expire') as Expire;
    const thisInvestor = await this.config.get('investor') as InvestorId;
    console.log('Loaded investor: ', thisInvestor);
    if (! thisInvestor || ! thisInvestor.UserName || ! thisInvestor.CustomerId )
      throw new Error(`Invalid investor: ${thisInvestor}`);
    await this.chart(thisInvestor);
    await this.stats(thisInvestor);
    if (await this.portfolio(thisInvestor, expire.mirror)) {
      const data = await this.repo.retrieve(thisInvestor.UserName + '.portfolio') as PortfolioData;
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
    );

    return this.fetchCount;
  }
}
