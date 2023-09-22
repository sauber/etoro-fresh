import { sprintf } from "printf";
import { assert } from "assert";
import { Downloadable } from "./asset.ts";
import { Investors } from "./investors.ts";
import { InvestorData } from "./investor.ts";

export interface DiscoverData {
  Status: string;
  TotalRows: number;
  Items: InvestorData[];
}

interface DiscoverFilter {
  daily: number;
  weekly: number;
  risk: number;
}

export class Discover extends Downloadable<DiscoverData> {
  protected readonly filename = "discover.json";
  protected readonly expire = 3000;
  static readonly urlTemplate =
    "https://www.etoro.com/sapi/rankings/rankings?client_request_id=%s&%s";
   
  protected async url(): Promise<string> {
    const filter_name = await this.repo.config.get('discover_filter') as string;
    const all_filters = await this.repo.config.get('discover_filters') as unknown as Record<string, DiscoverFilter>;
    const filter: DiscoverFilter = all_filters[filter_name];
    const filter_template = `blocked=false&bonusonly=false&copyblock=false&istestaccount=false&optin=true&page=1&period=OneYearAgo&verified=true&isfund=false&copiersmin=1&dailyddmin=-%d&gainmin=11&gainmax=350&maxmonthlyriskscoremax=%d&maxmonthlyriskscoremin=2&pagesize=70&profitablemonthspctmin=60&sort=-weeklydd&weeklyddmin=-%d&activeweeksmin=12&lastactivitymax=14`;
    const options: string = sprintf(filter_template, filter.daily, filter.risk, filter.weekly)
    const uuid: string = await this.uuid();
    const url: string = sprintf(Discover.urlTemplate, uuid, options);
    return url;
  }

  protected validate(data: DiscoverData): boolean {
    assert(data.TotalRows >= 70 && data.TotalRows <= 140, `TotalRows error 70 <= ${data.TotalRows} <= 140`);
    return true;
  }

  async investors(): Promise<Investors> {
    const investors = new Investors(this.repo);
    const data = await this.recent();
    for ( const investor of data.Items ) {
      investors.add(investor.UserName, investor.CustomerId);
    }
    return investors;
  }
}
