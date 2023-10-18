import { JSONObject, JSONValue, RepoBackend } from "./mod.ts";

type Defaults = Record<string, JSONValue>;

export class Config {
  static assetname = "config";

  constructor(private readonly backend: RepoBackend, private readonly defaults: Defaults = {}) {}

  /** create new Config object with default values */
  public withDefaults(defaults: Defaults): Config {
    return new Config(this.backend, defaults);
  }

  private async latest(): Promise<JSONObject> {
    const data: JSONObject | null = await this.backend.retrieve(Config.assetname);
    return data || {};
  }

  /** Return a single value */
  async get(key: string): Promise<JSONValue> {
    // Attempt to read from file
    const data: JSONObject = await this.latest();
    if (key in data) return data[key];

    // Defaults defined?
    if (key in this.defaults) return this.defaults[key];

    // Not in file and not in defaults
    return null;
  }

  /** Set a single value */
  async set(key: string, value: JSONValue): Promise<void> {
    const data: JSONObject = await this.latest();
    data[key] = value;
    return this.backend.store(Config.assetname, data);
  }
}
