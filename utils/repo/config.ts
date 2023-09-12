import { Asset, JSONObject, JSONValue } from "./asset.ts";

export class Config extends Asset<JSONObject> {
  readonly filename = "config.json";

  recent(): Promise<JSONObject> {
    return this.latest();
  }

  async get(key: string): Promise<JSONValue> {
    try {
      const latest: JSONObject = await this.latest();
      return latest[key];
    } catch (_error) {
    //  console.log(`Cannot load latest config`);
      return null;
    }
  }

  async set(key: string, value: JSONValue): Promise<void> {
    let data: JSONObject = {};
    try {
      const latest: JSONObject = await this.latest();
      data = latest;
    } catch (_error) {
      // console.log(`Cannot load previous config`);
    }

    data[key] = value;
    return this.write(data);
  }
}
