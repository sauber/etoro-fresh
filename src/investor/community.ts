import { RepoBackend } from "/repository/mod.ts";
import { DateFormat, today } from "/utils/time/calendar.ts";

type Names = string[];

/** Handle Community I/O requests to local repository */
export class Community {
  constructor(private readonly repo: RepoBackend) {}

  /** Identify all investor names in a directory */
  async names(date?: DateFormat): Promise<Names> {
    if ( ! date ) date = today();
    const files: string[] = await this.repo.assetsByDate(date);
    const valid = /[chart|portfolio|stats].json$/;

    // Catalog which file type exist for each investor name
    const catalog: Record<string, Record<string, boolean>> = {};
    files
      .filter((filename: string) => filename.match(valid))
      .forEach((filename: string) => {
        const [name, type, _ext] = filename.split(".");
        if (!(name in catalog)) catalog[name] = {};
        catalog[name][type] = true;
      });

    // Confirm each required file type exists for investor
    const names: Names = [];
    Object.entries(catalog).forEach(([key, value]) => {
      if ("chart" in value && "portfolio" in value && "stats" in value)
        names.push(key);
    });

    // Sorted names always give same answer
    return names.sort((Intl.Collator().compare));
  }

  async last(): Promise<Names> {
    const end: string = await this.repo.end();
    const names: Names = await this.repo.assetsByDate(end);
    return names;
  }
}
