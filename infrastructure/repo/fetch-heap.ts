import { FetchBackend, JSONObject } from "./repo.d.ts";


export type Assets = Record<string, JSONObject>;

export class FetchHeapBackend implements FetchBackend {
  constructor(private readonly assets: Assets) {}

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
