import { RepoBackend } from "/repository/mod.ts";
import { DateFormat, today } from "/utils/time/calendar.ts";
import { Investor } from "./investor.ts";

export type Names = Set<string>;

/** Handle Community I/O requests to local repository */
export class Community {
  constructor(private readonly repo: RepoBackend) {}

  /** Sort names alphabetically */
  static sortedNames(names: Names): Names {
    return new Set<string>([...names].sort(Intl.Collator().compare));
  }

  private async allNames(): Promise<Names> {
    let merged: Names = new Set();
    const dates: DateFormat[] = await this.repo.dates();
    for (const date of dates) {
      const names: Names = await this.namesByDate(date);
      merged = new Set([...merged, ...names]);
    }
    return Community.sortedNames(merged);
  }

  /** Identify all investor names on a date */
  public async namesByDate(date: DateFormat): Promise<Names> {
    const assets: string[] = await this.repo.assetsByDate(date);
    const valid = /(chart|portfolio|stats)$/;

    // Catalog which file type exist for each investor name
    //const catalog: Record<string, Record<string, boolean>> = {};
    const names: Names = new Set<string>();
    assets
      .filter((assetname: string) => assetname.match(valid) != null)
      .forEach((assetname: string) => {
        const [name, _type] = assetname.split(".");
        names.add(name);
      });

    // Sorted names always give same answer
    return Community.sortedNames(names);
  }

  /** Get list of names on last date available in repo */
  // TODO: Should this be in public interface?
  public async last(): Promise<Names> {
    const end: DateFormat | null = await this.end();
    if (end) {
      const names: Names = new Set(await this.repo.assetsByDate(end));
      return names;
    } else return new Set();
  }

  public end(): Promise<DateFormat | null> {
    return this.repo.end();
  }

  /** List of names optionally on a certain date  */
  public names(date?: DateFormat): Promise<Names> {
    if (date) return this.namesByDate(date);
    else return this.allNames();
  }

  public investor(username: string): Investor {
    return new Investor(
      this.repo.asset(username + ".chart"),
      this.repo.asset(username + ".portfolio"),
      this.repo.asset(username + ".stats"),
    )
  }
}
