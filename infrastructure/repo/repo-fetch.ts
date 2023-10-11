import { Repo, Asset, JSONObject } from "./repo.d.ts";
import { Config } from "./config.ts";
import { sprintf } from "printf";
import { Fetcher } from "./fetcher.ts";

type DiscoverFilter = {
  daily: number;
  weekly: number;
  risk: number;
}


/** Disk base storage for repository */
export class FetchRepo implements Repo {
  private site = "https://www.etoro.com";
  private readonly uuid: string;
  
  constructor(private readonly config: Config) {
    this.uuid = crypto.randomUUID();
  }

  /** Use rate limiting fetcher for loading web pages */
  private _fetcher: Fetcher|null = null;
  private async fetch(url: string): Promise<JSONObject> {
    if ( ! this._fetcher ) {
      const delay = await this.config.get("fetch-delay") as number;
      this._fetcher = new Fetcher(delay);
    }
    return this._fetcher.get(url);
  }

  private async discover(): Promise<JSONObject> {
    const urlTemplate =
    "/sapi/rankings/rankings?client_request_id=%s&%s";

    const filter_name = await this.config.get('discover_filter') as string;
    const all_filters = await this.config.get('discover_filters') as unknown as Record<string, DiscoverFilter>;
    const filter: DiscoverFilter = all_filters[filter_name];
    const filter_template = `blocked=false&bonusonly=false&copyblock=false&istestaccount=false&optin=true&page=1&period=OneYearAgo&verified=true&isfund=false&copiersmin=1&dailyddmin=-%d&gainmin=11&gainmax=350&maxmonthlyriskscoremax=%d&maxmonthlyriskscoremin=2&pagesize=70&profitablemonthspctmin=60&sort=-weeklydd&weeklyddmin=-%d&activeweeksmin=12&lastactivitymax=14`;
    const options: string = sprintf(filter_template, filter.daily, filter.risk, filter.weekly)
    const uuid: string = this.uuid;
    const url: string = this.site + sprintf(urlTemplate, uuid, options);

    return this.fetch(url);
  }

  public last(asset: Asset): Promise<JSONObject|null> {
    switch (asset) {
      case 'discover':
        return this.discover();
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
