import { sprintf } from "printf";
import { assert } from "assert";
import { Downloadable } from "./asset.ts";
import { Investors } from "./investors.ts";

export interface DiscoverData {
  Status: string;
  TotalRows: number;
  Items: InvestorData[];
}

export class Discover extends Downloadable<DiscoverData> {
  protected readonly filename = "discover.json";
  protected readonly expire = 3000;
  static readonly urlTemplate =
    "https://www.etoro.com/sapi/rankings/rankings?client_request_id=%s&%s";
   
  protected async url(): Promise<string> {
    const daily = 4;
    const weekly = 11;
    const risk = 4;
    const filter = `blocked=false&bonusonly=false&copyblock=false&istestaccount=false&optin=true&page=1&period=OneYearAgo&verified=true&isfund=false&copiersmin=1&dailyddmin=-${daily}&gainmin=11&gainmax=350&maxmonthlyriskscoremax=${risk}&maxmonthlyriskscoremin=2&pagesize=70&profitablemonthspctmin=60&sort=-weeklydd&weeklyddmin=-${weekly}&activeweeksmin=12&lastactivitymax=14`;
    const uuid = await this.uuid();
    const url = sprintf(Discover.urlTemplate, uuid, filter);
    return url;
  }

  protected validate(data: DiscoverData): boolean {
    assert(data.TotalRows >= 70 && data.TotalRows <= 140);
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
