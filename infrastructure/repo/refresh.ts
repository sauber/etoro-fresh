import {
  RepoBackend,
  FetchBackend,
  InvestorId,
  DiscoverParams,
  JSONObject,
} from "./repo.d.ts";
import { Fetch } from "./fetch.ts";
import { Discover, DiscoverData } from "./discover.ts";
import { Portfolio, PortfolioData } from "./portfolio.ts";
import { ChartData } from "./chart.ts";
import { StatsData } from "./stats.ts";

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

  /** Load  asset from disk or web */
  private async recent(
    assetname: string,
    expire: number,
    web: () => Promise<JSONObject>
  ): Promise<JSONObject | null> {
    const age: number | null = await this.repo.age(assetname);
    if (!age || age > expire) {
      console.log(`Loading ${assetname} from web`);
      const data: JSONObject = await web();
      ++this.fetchCount;
      await this.repo.store(assetname, data);
      return data;
    } else {
      console.log(`Loading ${assetname} from disk`);
      return await this.repo.retrieve(assetname);
    }
  }

  /** Load investor ID's from discovery */
  private async discover(): Promise<InvestorId[]> {
    // TODO: Validate data
    const data = (await this.recent("discover", this.expire.discover, () =>
      this.fetch.discover(this.filter)
    )) as DiscoverData;
    const discover: Discover = new Discover(data);
    const investors: InvestorId[] = discover.investors();
    return investors;
  }

  private async chart(investor: InvestorId): Promise<ChartData> {
    // TODO: Confirm last data is today
    return (await this.recent(
      investor.UserName + ".chart",
      this.expire.chart,
      () => this.fetch.chart(investor)
    )) as ChartData;
  }

  private async portfolio(investor: InvestorId): Promise<PortfolioData> {
    // TODO: Validate data
    return (await this.recent(
      investor.UserName + ".portfolio",
      this.expire.portfolio,
      () => this.fetch.portfolio(investor)
    )) as PortfolioData;
  }

  private async stats(investor: InvestorId): Promise<StatsData> {
    // TODO: Validate data
    return (await this.recent(
      investor.UserName + ".stats",
      this.expire.stats,
      () => this.fetch.stats(investor)
    )) as StatsData;
  }

  private loadInvestor(investor: InvestorId): Promise<JSONObject[]> {
    return Promise.all([
      this.chart(investor),
      this.portfolio(investor),
      this.stats(investor),
    ]);
  }

  private async mirrors(): Promise<InvestorId[]> {
    const data = (await this.portfolio(this.investor)) as PortfolioData;
    const portfolio: Portfolio = new Portfolio(data);
    const investors: InvestorId[] = portfolio.investors();
    return investors;
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
