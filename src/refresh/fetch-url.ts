import { sprintf } from "printf";
import type { InvestorId } from "/investor/mod.ts";
import { Config, JSONValue } from "/repository/mod.ts";

type DiscoverFilter = {
  risk: number;
  daily: number;
  weekly: number;
}

type URL = string;

/** Disk base storage for repository */
export class FetchURL {
  private static defaults: Record<string, JSONValue> = {
    discover_filter: { risk: 4, daily: 6, weekly: 11 } as DiscoverFilter,
    //discover_items: { min: 70, max: 140 },
  };

  private site = "https://www.etoro.com";
  private readonly uuid = crypto.randomUUID();
  readonly config: Config;

  constructor(config: Config) {
    this.config = config.withDefaults(FetchURL.defaults);
  }

  public async discover(): Promise<URL> {
    const filter = await this.config.get('discover_filter') as DiscoverFilter;
    const urlTemplate = "/sapi/rankings/rankings?client_request_id=%s&%s";
    const filter_template = `blocked=false&bonusonly=false&copyblock=false&istestaccount=false&optin=true&page=1&period=OneYearAgo&verified=true&isfund=false&copiersmin=1&dailyddmin=-%d&gainmin=11&gainmax=350&maxmonthlyriskscoremax=%d&maxmonthlyriskscoremin=2&pagesize=70&profitablemonthspctmin=60&sort=-weeklydd&weeklyddmin=-%d&activeweeksmin=12&lastactivitymax=14`;
    const options: string = sprintf(
      filter_template,
      filter.daily,
      filter.risk,
      filter.weekly
    );
    const url: string = this.site + sprintf(urlTemplate, this.uuid, options);
    return url;
  }

  public chart(investor: InvestorId): URL {
    const urlTemplate =
      //"https://www.etoro.com/sapi/trade-data-real/chart/public/%s/oneYearAgo/1?client_request_id=%s";
      "/sapi/userstats/CopySim/Username/%s/OneYearAgo?client_request_id=%s";
    const url: string =
      this.site + sprintf(urlTemplate, investor.UserName, this.uuid);
    return url;
  }

  public portfolio(investor: InvestorId): URL {
    const urlTemplate =
      "/sapi/trade-data-real/live/public/portfolios?cid=%d&client_request_id=%s";
    const url: string = this.site + sprintf(urlTemplate, investor.CustomerId, this.uuid);
    return url;
  }

  public stats(investor: InvestorId): URL {
    const urlTemplate =
      "/sapi/rankings/cid/%d/rankings?Period=OneYearAgo&client_request_id=%s";
    const url: string = this.site + sprintf(urlTemplate, investor.CustomerId, this.uuid);
    return url;
  }
}
