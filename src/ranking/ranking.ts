import type { DateFormat } from "/utils/time/mod.ts";
import { Community, Investor, Stats } from "/investor/mod.ts";
import type { Names } from "/investor/mod.ts";
import type { StatsData } from "/investor/mod.ts";
import { Asset } from "/repository/mod.ts";

export class Ranking {
  constructor(private readonly community: Community){}

  public names(): Promise<Names> {
    return this.community.names();
  }


  public async gain(username: string): Promise<number> {
    const investor: Investor = this.community.investor(username);
    const stats: Asset<StatsData> = investor.statsSeries;
    const start: DateFormat = await stats.start();
    return 0; // TODO


  }
}