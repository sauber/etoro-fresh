import { RepoBackend } from "/repository/mod.ts";
import { DateFormat } from "/utils/time/mod.ts";
import { Investor } from "./investor.ts";
import { TextSeries } from "/utils/series.ts";

export type Names = TextSeries;

/** Handle Community I/O requests to local repository */
export class Community {
  constructor(private readonly repo: RepoBackend) {}

  /** Unit set of names across all dates */
  private async allNames(): Promise<Names> {
    const dates: DateFormat[] = await this.repo.dates();
    const allDates: Names[] = await Promise.all(
      dates.map((date) => this.namesByDate(date)),
    );
    const allNames: string[][] = allDates.map((date) => date.values);
    const merged = new Set(allNames.flat());
    return new TextSeries([...merged]);
  }

  /** Identify all investor names on a date */
  public async namesByDate(date: DateFormat): Promise<Names> {
    const assets: string[] = await this.repo.assetsByDate(date);
    const valid = /(chart|portfolio|stats)$/;

    // Catalog which file type exist for each investor name
    const names = new Set<string>();
    assets
      .filter((assetname: string) => assetname.match(valid) != null)
      .forEach((assetname: string) => {
        const [name, _type] = assetname.split(".");
        names.add(name);
      });
    return new TextSeries([...names]);
  }

  /** Get list of names on last date available in repo */
  // TODO: Should this be in public interface?
  public async last(): Promise<Names> {
    const end: DateFormat | null = await this.end();
    if (end) return this.namesByDate(end);
    else return Promise.resolve(new TextSeries());
  }

  /** The last directory where names exists */
  public async end(): Promise<DateFormat | null> {
    const dates: DateFormat[] = await this.repo.dates();
    for (const date of dates.reverse()) {
      if ((await this.namesByDate(date)).length) return date;
    }
    return null;
  }

  /** List of names optionally on a certain date  */
  public names(date?: DateFormat): Promise<Names> {
    if (date) return this.namesByDate(date);
    else return this.allNames();
  }

  private _loaded: Record<string, Investor> = {};
  public investor(username: string): Investor {
    if (!(username in this._loaded)) {
      this._loaded[username] = new Investor(
        //this.repo.asset(username + ".chart"),
        //his.repo.asset(username + ".portfolio"),
        //this.repo.asset(username + ".stats"),
        username, this.repo
      );
    }
    return this._loaded[username];
  }
}
