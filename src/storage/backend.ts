import type { JSONObject, AssetName, AssetNames } from "./mod.ts";

export abstract class Backend {
  /** A partition of assets */
  abstract sub(partition: string): Promise<Backend>;

  /** List of all partition names */
  abstract dirs(): Promise<string[]>;

  /** Store an asset object */
  abstract store(assetname: AssetName, data: JSONObject): Promise<void>;

  /** Load asset object */
  abstract retrieve(assetname: AssetName): Promise<JSONObject>;

  /** Verify if asset exists */
  abstract has(assetname: AssetName): Promise<boolean>;

  /** List of asset names */
  abstract names(): Promise<AssetNames>;

  /** Number of milliseconds since most recent version stored */
  abstract age(assetname: AssetName): Promise<number>;

  /** Number of milliseconds since most recent version stored */
  abstract delete(assetname: AssetName): Promise<void>;
}
