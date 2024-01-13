import { RepoBackend } from "../storage/mod.ts";
import { DateFormat } from "/utils/time/mod.ts";
import { Investor } from "../investor/investor.ts";
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
  public async last(): Promise<Names> {
    const end: DateFormat | null = await this.end();
    if (end) return this.namesByDate(end);
    else return Promise.resolve(new TextSeries());
  }

  /** Confirm if there are any names in a directory */
  private async dateHasNames(date: DateFormat): Promise<boolean> {
    if ((await this.namesByDate(date)).length) return true;
    return false;
  }

  /** The first directory where names exists */
  public async start(): Promise<DateFormat | null> {
    const dates: DateFormat[] = await this.repo.dates();
    for (const date of dates) {
      if (await this.dateHasNames(date)) return date;
    }
    return null;
  }

  /** The last directory where names exists */
  public async end(): Promise<DateFormat | null> {
    const dates: DateFormat[] = await this.repo.dates();
    for (const date of dates.reverse()) {
      if (await this.dateHasNames(date)) return date;
    }
    return null;
  }

  /** List of names optionally on a certain date  */
  public names(date?: DateFormat): Promise<Names> {
    if (date) return this.namesByDate(date);
    else return this.allNames();
  }

  public validName(username: string): Promise<boolean> {
    return this.investor(username).isValid();
  }

  /** List of names with underlying valid data optionally on a certain date  */
  public async valid(date?: DateFormat): Promise<Names> {
    const allNames: Names = await this.names(date);
    const validVector: Array<boolean> = await Promise.all(
      allNames.values.map((name) => this.investor(name).isValid()),
    );
    const validNames: string[] = allNames.values.filter(
      (_name, index) => validVector[index],
    );
    const result: Names = new TextSeries(validNames);
    return result;
  }

  /** All investors where date is within active range */
  public async active(date: DateFormat): Promise<Names> {
    const allNames: Names = await this.names();
    const validVector: Array<boolean> = await Promise.all(
      allNames.values.map((name) => this.investor(name).active(date)),
    );
    const validNames: string[] = allNames.values.filter(
      (_name, index) => validVector[index],
    );
    const result: Names = new TextSeries(validNames);
    return result;
  }

  private _loaded: Record<string, Investor> = {};
  /** Create and cache Investor object */
  public investor(username: string): Investor {
    if (!(username in this._loaded)) {
      this._loaded[username] = new Investor(username, this.repo);
    }
    return this._loaded[username];
  }

  /** Get random investor */
  public async any(): Promise<Investor> {
    const names: Names = await this.names();
    const name: string = names.any;
    return this.investor(name);
  }
}
