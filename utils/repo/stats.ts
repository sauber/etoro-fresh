import { sprintf } from "printf";
import { assertEquals } from "assert";
import { Downloadable } from "./asset.ts";
import { Repo } from "./repo.ts";

export interface StatsData {
  Data: {
    CustomerId: number,
    UserName: string
  }
}

export class Stats extends Downloadable<StatsData> {
  protected readonly filename: string;
  static readonly urlTemplate =
    "https://www.etoro.com/sapi/rankings/cid/%d/rankings?Period=OneYearAgo&client_request_id=%s";
  protected readonly expire = 20000; // Max age in miutes

  constructor(
    protected readonly repo: Repo,
    private readonly username: string,
    private readonly cis: number
  ) {
    super(repo);
    this.filename = `${username}.stats.json`;
    }

  protected async url(): Promise<string> {
    return sprintf(Stats.urlTemplate, this.cis, await this.uuid());
  }

  protected validate(data: StatsData): boolean {
    assertEquals(data.Data.CustomerId, this.cis);
    return true;
  }

}
