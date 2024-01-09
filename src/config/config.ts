import type { JSONObject, JSONValue } from "📚/repository/mod.ts";
import { Backend, Asset } from "📚/repository/mod.ts";

export class Config {
  private static readonly assetname = "config";
  private readonly asset: Asset<JSONObject>;

  constructor(
    private readonly repo: Backend,
    private readonly defaults: JSONObject = {}
  ) {
    this.asset = new Asset<JSONObject>(Config.assetname, repo);
  }

  /** create new Config object with default values */
  public withDefaults(defaults: JSONObject): Config {
    return new Config(this.repo, defaults);
  }

  private last(): Promise<JSONObject> {
    return this.asset.last();
  }

  /** Return a single value */
  async get(key: string): Promise<JSONValue> {
    // Attempt to read from file
    const data: JSONObject = await this.last();
    if (data && key in data) return data[key];

    // Defaults defined?
    if (key in this.defaults) return this.defaults[key];

    // Not in file and not in defaults
    return null;
  }

  /** Set or overwrite a single value */
  async set(key: string, value: JSONValue): Promise<void> {
    const data: JSONObject = await this.last();
    if (data) {
      data[key] = value;
      return this.asset.store(data);
    } else {
      console.log('Storing new config object');
      return this.asset.store({ key: value });
    }
  }
}
