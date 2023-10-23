import { FetchBackend } from "./mod.ts";
import { Config, JSONObject } from "/repository/mod.ts";

export type Assets = Record<string, JSONObject>;

export class FetchHeapBackend implements FetchBackend {
  constructor(private readonly assets: Assets, readonly config: Config) {}

  public get(url: string): Promise<JSONObject> {
    return new Promise((resolve) => {
      // Search all assets for a matching one
      for (const [assetname, data] of Object.entries(this.assets)) {
        if ( url.includes(assetname) ) return resolve(data);
      }
      resolve({});
    });
  }
}
