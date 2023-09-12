import { sprintf } from "printf";
import { assert } from "assert";
import { Files } from "./files.ts";
import { Asset } from "./asset.ts";

export interface DiscoverData {
  Status: string;
  TotalRows: number;
  Items: Record<string, string | never>[];
}

export class Discover extends Asset<DiscoverData> {
  readonly filename = "discover.json";
  static readonly url =
    "https://www.etoro.com/sapi/rankings/rankings?client_request_id=%s&%s";
  static readonly expire = 3000; // Max age in miutes

  private async download(): Promise<DiscoverData> {
    const daily = 4;
    const weekly = 11;
    const risk = 4;
    const filter = `blocked=false&bonusonly=false&copyblock=false&istestaccount=false&optin=true&page=1&period=OneYearAgo&verified=true&isfund=false&copiersmin=1&dailyddmin=-${daily}&gainmin=11&gainmax=350&maxmonthlyriskscoremax=${risk}&maxmonthlyriskscoremin=2&pagesize=70&profitablemonthspctmin=60&sort=-weeklydd&weeklyddmin=-${weekly}&activeweeksmin=12&lastactivitymax=14`;
    const uuid = await this.repo.uuid.recent();
    const url = sprintf(Discover.url, uuid, filter);

    const fs: Files = this.repo.files;
    const content: string = await fs.download(url);
    const data = JSON.parse(content) as DiscoverData;
    return data;
  }

  private validate(data: DiscoverData): boolean {
    assert(data.TotalRows >= 70 && data.TotalRows <= 140);
    return true;
  }

  async recent(): Promise<DiscoverData> {
    const files = this.repo.files;
    const age = await files.age(this.filename);
    if (!age || age > Discover.expire) {
      const data: DiscoverData = await this.download();
      files.write(this.filename, JSON.stringify(data));
      return data;
    } else {
      const data = await this.latest();
      if (data) return data as DiscoverData;
    }
    throw new Error("Discovery file not downloaded");
  }
}
