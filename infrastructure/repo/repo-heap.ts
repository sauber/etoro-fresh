import { RepoAbstractBackend } from "./repo-abstract-backend.ts";
import { JSONObject } from "./repo.d.ts";
import { today, DateFormat } from "/infrastructure/time/calendar.ts";

/** Storing objects in process memory */
export class HeapRepo extends RepoAbstractBackend {
  private cache: Record<DateFormat, Record<string, JSONObject>> = {};

  delete(): Promise<void> {
    for (const key in this.cache) delete this.cache[key];
    return new Promise((resolve) => resolve());
  }

  private save(key: string, data: JSONObject): void {
    const date: DateFormat = today();
    if (!(date in this.cache)) this.cache[date] = {};
    this.cache[date][key] = data;
  }

  private keys(): DateFormat[] {
    return Object.keys(this.cache).sort();
  }

  private load(key: string, date?: DateFormat): JSONObject {
    if (!date) date = this.keys().reverse()[0];
    return this.cache[date][key];
  }

  public store(assetname: string, data: JSONObject): Promise<void> {
    return new Promise((resolve) => {
      this.save(assetname, data);
      resolve();
    });
  }

  public retrieve(
    assetname: string,
    date?: string | undefined
  ): Promise<JSONObject> {
    return new Promise((resolve, reject) => {
      if (!date) {
        const dates = this.keys();
        for (const d of dates) {
          if (assetname in this.cache[d]) date = d;
        }
      }
      if (date) resolve(this.cache[date][assetname]);
      else reject(`${assetname} not in repo`);
    });
  }

  public dates(): Promise<DateFormat[]> {
    return new Promise((resolve) => resolve(this.keys()));
  }

  /** List of all asset available on a certain date */
  public assetsByDate(date: DateFormat): Promise<string[]> {
    return new Promise((resolve) => {
      const keys =
        date in this.cache ? Object.keys(this.cache[date]).sort() : [];
      resolve(keys);
    });
  }

  /** List all dates having asset */
  public datesByAsset(assetname: string): Promise<string[]> {
    return new Promise((resolve) => {
      const dates: DateFormat[] = [];
      for (const date of this.keys()) {
        if (assetname in this.cache[date]) dates.push(date);
      }
      resolve(dates);
    });
  }
}
