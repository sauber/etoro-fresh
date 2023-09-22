import { Asset, JSONObject, JSONValue } from "./asset.ts";

export class Config extends Asset<JSONObject> {
  readonly filename = "config.json";

  static defaults: Record<string, JSONValue> = {
    discover_filter: "B",
    discover_filters: {
      A: {
        daily: 4,
        weekly: 11,
        risk: 4,
      },
      B: {
        daily: 6,
        weekly: 11,
        risk: 4,
      },
    },
    discover_min: 70,
    discover_max: 140,
  };

  recent(): Promise<JSONObject> {
    return this.latest();
  }

  async get(key: string): Promise<JSONValue> {
    // Attempt to read from file
    try {
      const latest: JSONObject = await this.latest();
      return latest[key];
    } catch (_error) {
      //  console.log(`Cannot load latest config`);
    }

    // Defaults defined?
    if (Config.defaults[key]) return Config.defaults[key];

    // Not in file and not in defaults
    return null;
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
