import { JSONObject } from "./mod.ts";
import { RepoBackend } from "./repo-backend.ts";
import { today, DateFormat } from "/utils/time/mod.ts";

type Asset = {
  name: string;
  date: DateFormat;
  mtime: number;
  content: string;
};

/** Storing objects in process memory */
export class RepoHeapBackend extends RepoBackend {
  private cache: Asset[] = [];

  public delete(): Promise<void> {
    return new Promise((resolve) => {
      this.cache.length = 0;
      resolve()
    });
  }

  public store(assetname: string, data: JSONObject): Promise<void> {
    return new Promise((resolve) => {
      const date: DateFormat = today();

      // Delete previous entry with same name/date;
      const index =  this.cache.findIndex((asset: Asset) => ( asset.name == assetname && asset.date == date ));
      if ( index > -1 ) this.cache.splice(index, 1);

      // Add new asset
      // Added at beginning to make it faster to find most recent
      this.cache.unshift({
        name: assetname,
        date: date,
        mtime: (new Date()).getTime(),
        content: JSON.stringify(data)
      })
        
       resolve();
    });
  }

  public retrieve(
    assetname: string,
    date?: string | undefined
  ): Promise<JSONObject|null> {
    return new Promise((resolve) => {
      const asset: Asset|undefined = (date)
        ? this.cache.find((asset: Asset) => ( asset.name == assetname && asset.date == date ))
        : this.cache.find((asset: Asset) => ( asset.name == assetname ));

      if ( asset ) resolve(JSON.parse(asset.content))
      else resolve(null)
    });
  }


  public age(assetname: string): Promise<number|null> {
    return new Promise((resolve) => {
      const asset: Asset|undefined =  this.cache.find((asset: Asset) => ( asset.name == assetname ));

      if ( asset )
        resolve( (new Date()).getTime() - asset.mtime )
      else
        resolve(null)
    });
  }

  public dates(): Promise<DateFormat[]> {
    return new Promise((resolve) => {
      // Syntax for uniq: list = list.filter((x, i, a) => a.indexOf(x) == i)
      const dates: DateFormat[] = this.cache.map((asset: Asset) => asset.date).filter((x, i, a) => a.indexOf(x) == i);
      resolve(dates);
    });
  }

  public end(): Promise<DateFormat|null> {
    return new Promise((resolve) => {
      const l = this.cache.length;
      resolve(l > 0 ? this.cache[l-1].date : null);
  });
}

  /** List of all asset names available on a certain date */
  public assetsByDate(date: DateFormat): Promise<string[]> {
    return new Promise((resolve) => {
      resolve(this.cache.filter((asset: Asset) => asset.date == date).map((asset: Asset) => asset.name));
    });
  }

  /** List all dates having asset */
  public datesByAsset(assetname: string): Promise<DateFormat[]> {
    return new Promise((resolve) => {
      resolve(this.cache.filter((asset: Asset) => asset.name == assetname).map((asset: Asset) => asset.date));
    });
  }
}
