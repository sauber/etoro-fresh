import { JSONObject, RepoBackend } from "./repo.d.ts";
import { today, DateFormat } from "/infrastructure/time/calendar.ts";

/** Storing objects in process memory */
export class RepoHeapBackend implements RepoBackend {
  private cache: Record<DateFormat, Record<string, JSONObject>> = {};

  public delete(): Promise<void> {
    return new Promise((resolve) => {
      for (const key in this.cache) delete this.cache[key];
      resolve()
    });
  }

  private keys(): DateFormat[] {
    return Object.keys(this.cache).sort();
  }

  public store(assetname: string, data: JSONObject): Promise<void> {
    return new Promise((resolve) => {
      const date: DateFormat = today();
      if (!(date in this.cache)) this.cache[date] = {};
      this.cache[date][assetname] = data;
      resolve();
    });
  }

  public retrieve(
    assetname: string,
    date?: string | undefined
  ): Promise<JSONObject|null> {
    return new Promise((resolve, reject) => {
      if (!date) {
        const dates = this.keys();
        for (const d of dates) {
          if (assetname in this.cache[d]) date = d;
        }
      }
      if (date) resolve(this.cache[date][assetname]);
      else resolve(null);
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
