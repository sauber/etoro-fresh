import { Repo, Asset, JSONObject } from "./repo.d.ts";
import { sprintf } from "printf";
import { Fetcher } from "./fetcher.ts";

type DiscoverParams = {
  daily: number;
  weekly: number;
  risk: number;
};

type InvestorParams = {
  username: string;
  cid: number;
};

/** Disk base storage for repository */
export class FetchRepo implements Repo {
  private site = "https://www.etoro.com";
  private readonly uuid = crypto.randomUUID();

  constructor(private readonly delay: number = 5000) {}

  /** Use rate limiting fetcher for loading web pages */
  private _fetcher: Fetcher | null = null;
  private fetch(url: string): Promise<JSONObject> {
    if (!this._fetcher) this._fetcher = new Fetcher(this.delay);
    return this._fetcher.get(url);
  }

  private discover(filter: DiscoverParams): Promise<JSONObject> {
    const urlTemplate = "/sapi/rankings/rankings?client_request_id=%s&%s";
    const filter_template = `blocked=false&bonusonly=false&copyblock=false&istestaccount=false&optin=true&page=1&period=OneYearAgo&verified=true&isfund=false&copiersmin=1&dailyddmin=-%d&gainmin=11&gainmax=350&maxmonthlyriskscoremax=%d&maxmonthlyriskscoremin=2&pagesize=70&profitablemonthspctmin=60&sort=-weeklydd&weeklyddmin=-%d&activeweeksmin=12&lastactivitymax=14`;
    const options: string = sprintf(
      filter_template,
      filter.daily,
      filter.risk,
      filter.weekly
    );
    const url: string = this.site + sprintf(urlTemplate, this.uuid, options);
    return this.fetch(url);
  }

  public last(
    asset: Asset,
    options: DiscoverParams | InvestorParams
  ): Promise<JSONObject | null> {
    switch (asset) {
      case "discover":
        return this.discover(options);
    }
    throw new Error(`Cannot fetch ${asset} asset`);
  }

  store(_asset: Asset, _data: JSONObject): Promise<void> {
    throw new Error("Cannot store data on remote website");
  }

  delete(): Promise<void> {
    throw new Error("Cannot delete remote website");
  }
}
