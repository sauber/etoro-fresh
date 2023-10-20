import type { JSONObject } from "/repository/mod.ts"
import type { DiscoverParams } from "./mod.ts";
import { FetchBackend } from "./mod.ts";
import type { InvestorId } from "/investor/mod.ts";
import { FetchURL } from "./fetch-url.ts";

/** Generate URL to assets */
export class Fetch {
  private readonly url = new FetchURL();

  constructor(private readonly fetcher: FetchBackend ) {}

  public discover(filter: DiscoverParams): Promise<JSONObject> {
    return this.fetcher.get(this.url.discover(filter));
  }

  public chart(investor: InvestorId): Promise<JSONObject> {
    return this.fetcher.get(this.url.chart(investor));
  }

  public portfolio(investor: InvestorId): Promise<JSONObject> {
    return this.fetcher.get(this.url.portfolio(investor));
  }

  public stats(investor: InvestorId): Promise<JSONObject> {
    return this.fetcher.get(this.url.stats(investor));
  }
}
