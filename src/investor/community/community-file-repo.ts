import { Files } from "/utils/repo/files.ts";
import { CommunityRepo, Names } from "./community.ts";

/** Handle Community I/O requests to local reposotiry */
export class CommunityFileRepo implements CommunityRepo {
  constructor(private readonly files: Files) {}

  /** Identify all investor names in a directory */
  private async names(dir: Files): Promise<Names> {
    const files: string[] = await dir.files();
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
    const dirName: string = await this.files.last();
    const dir = this.files.sub(dirName);
    const names: Names = await this.names(dir);
    return names;
  }
}
