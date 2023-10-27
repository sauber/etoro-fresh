import { DiscoverFilter } from "./mod.ts";
import { FetchBackend } from "./mod.ts";
import type { JSONObject } from "/repository/mod.ts";
import type { InvestorId } from "/investor/mod.ts";
import { FetchURL } from "./fetch-url.ts";
import { RateLimit } from "./ratelimit.ts";
import { fetchjson } from "./fetch-json.ts";

export type Assets = Record<string, JSONObject>;

/** Fetch objects from eToro API */
export class FetchWebBackend implements FetchBackend {
  private readonly url = new FetchURL();
  private readonly ratelimit: RateLimit;

  constructor(private readonly rate: number) {
    this.ratelimit = new RateLimit(rate);
  }

  /** Ratelimit calls to fetchjson */
  private fetch(url: string): Promise<JSONObject> {
    return this.ratelimit.limit(() => fetchjson(url)) as Promise<JSONObject>;
  }

  public discover(filter: DiscoverFilter): Promise<JSONObject> {
    return this.fetch(this.url.discover(filter));
  }

  public chart(investor: InvestorId): Promise<JSONObject> {
    return this.fetch(this.url.chart(investor));
  }

  public portfolio(investor: InvestorId): Promise<JSONObject> {
    return this.fetch(this.url.portfolio(investor));
  }

  public stats(investor: InvestorId): Promise<JSONObject> {
    return this.fetch(this.url.stats(investor));
  }
}
