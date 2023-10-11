import { Asset, Repo, JSONObject, JSONValue } from "./repo.d.ts";

export class Config {
  static assetname: Asset = "config";

  static defaults: Record<string, JSONValue> = {
    discover_risk: 4,
    discover_daily: 6,
    discover_weekly: 11,
    discover_min: 70,
    discover_max: 140,
    fetch_delay: 5000,
  };

  constructor(private readonly repo: Repo) {}

  private async latest(): Promise<JSONObject> {
    const data: JSONObject | null = await this.repo.last(Config.assetname);
    return data ? data : {};
  }

  /** Return a single value */
  async get(key: string): Promise<JSONValue> {
    // Attempt to read from file
    const data: JSONObject = await this.latest();
    if (key in data) return data[key];

    // Defaults defined?
    if (key in Config.defaults) return Config.defaults[key];

    // Not in file and not in defaults
    return null;
  }

  /** Set a single value */
  async set(key: string, value: JSONValue): Promise<void> {
    const data: JSONObject = await this.latest();
    data[key] = value;
    return this.repo.store(Config.assetname, data);
  }
}
