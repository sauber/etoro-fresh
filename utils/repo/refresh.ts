import { Repo } from "./repo.ts";
import { Investor } from "./investor.ts";
import { Investors } from "./investors.ts";
  
/** Load all data for all investors */
export class Refresh {
  constructor(private readonly repo: Repo, readonly username: string, readonly cid: number, readonly max?: number ) {}

  /** Generate list of investors, combination of discovery, user and mirrors of user */
  private async investors(): Promise<Investors> {
    const combined = new Investors(this.repo);

    // Add user
    const investor: Investor = combined.add(this.username, this.cid);

    await Promise.all([
      // Add mirrors of user
      investor.portfolio.mirrors().then( (inv: Investors) => combined.extend(inv)),

      // Add discovery
      this.repo.discover.investors().then( (inv: Investors) => combined.extend(inv))
    ]);

    return combined;
  }

  /** Load all data for one investor */
  private async load(investor: Investor): Promise<void> {
    // Run in parallel
    const portfolio = investor.portfolio.recent().then( () => console.log(`Loaded portfolio ${investor.username}`));
    const stats = investor.stats.recent().then( () => console.log(`Loaded stats for ${investor.username}`));
    const chart = investor.chart.recent().then( () => console.log(`Loaded chart for ${investor.username}`));
    
    await portfolio;
    await stats;
    await chart;
  }

  async run(): Promise<number> {
    const investors: Investors = await this.investors();
    const all = investors.all;
    const subset = this.max ? all.slice(0,this.max) : all;
    console.log(subset);
    
    // Run in parallel
    await Promise.all(
      //subset.map( (investor: Investor) => this.load(investor))
      subset.map( (investor: Investor) => console.log(investor.username))
    );

    return subset.length;
  }
}
