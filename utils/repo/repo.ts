//import { today } from "/utils/calendar.ts";
import Files from "/utils/repo/files.ts";
import { sprintf } from "printf";
import { assert } from "assert";

///////////////////////////////////////////////////////////////////////
// Generic File
///////////////////////////////////////////////////////////////////////

abstract class Asset<U> {
  abstract readonly filename: string;
  abstract latest(): Promise<U>; // Most recent file
  abstract recent(): Promise<U>; // Refresh file if expired
}

///////////////////////////////////////////////////////////////////////
// Discover
///////////////////////////////////////////////////////////////////////

export interface DiscoverData {
  Status: string;
  TotalRows: number;
  Items: Record<string, string | never>[];
}

export class Discover implements Asset<DiscoverData> {
  readonly filename = "discover.json";
  static readonly url =
    "https://www.etoro.com/sapi/rankings/rankings?client_request_id=%s&%s";
  static readonly expire = 3000; // Max age in miutes

  constructor(protected readonly repo: Repo) {}

  private async download(): Promise<DiscoverData> {
    const daily = 4;
    const weekly = 11;
    const risk = 4;
    const filter = `blocked=false&bonusonly=false&copyblock=false&istestaccount=false&optin=true&page=1&period=OneYearAgo&verified=true&isfund=false&copiersmin=1&dailyddmin=-${daily}&gainmin=11&gainmax=350&maxmonthlyriskscoremax=${risk}&maxmonthlyriskscoremin=2&pagesize=70&profitablemonthspctmin=60&sort=-weeklydd&weeklyddmin=-${weekly}&activeweeksmin=12&lastactivitymax=14`;
    const url = sprintf(Discover.url, this.repo.uuid, filter);

    const fs: Files = this.repo.files;
    const content: string = await fs.download(url);
    const data = JSON.parse(content) as DiscoverData;
    return data;
  }

  private validate(data: DiscoverData): boolean {
    assert(data.TotalRows >= 70 && data.TotalRows <= 140);
    return true;
  }

  async latest(): Promise<DiscoverData> {
    const files = this.repo.files;
    const latestPath = await files.latest(this.filename);
    //console.log("path: ", latestPath);
    if(!latestPath) throw new Error(`File ${this.filename} not found`);
    const content = await files.read(latestPath);
    const data = JSON.parse(content) as DiscoverData;
    return data;
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
      if ( data ) return data as DiscoverData;
    }
    throw new Error("Discovery file not downloaded");
  }
}

///////////////////////////////////////////////////////////////////////
// Repository
///////////////////////////////////////////////////////////////////////

export class Repo {
  readonly files: Files;

  constructor(private readonly path: string) {
    this.files = new Files(path);
  }

  /** Create repo in tmp directory */
  static async tmp(): Promise<Repo> {
    const files: Files = await Files.tmp();
    return new Repo(files.path);
  }

  /** Delete repository */
  delete(): Promise<void> {
    return this.files.delete();
  }

  /** Session ID */
  get uuid(): string {
    // TODO: Read from config file
    return "52eb50a8-90c6-4e64-832f-7a9d685164aa";
  }

  get discover(): Discover {
    return new Discover(this);
  }
}
