import { Backend } from "../repository/backend.ts";
import type { JSONObject, AssetName, AssetNames } from "../repository/mod.ts";

/** Store data objects in memory */
export class HeapBackend implements Backend {
  private readonly heap: Record<string, JSONObject> = {};
  private readonly partitions: Record<string, HeapBackend> = {};

  public sub(name: string): Promise<Backend> {
    if ( ! (name in this.partitions)) this.partitions[name] = new HeapBackend();
    return Promise.resolve(this.partitions[name]);
  }

  public dirs(): Promise<string[]> {
    return Promise.resolve(Object.keys(this.partitions));
  }

  public has(assetname: AssetName): Promise<boolean> {
    return Promise.resolve(assetname in this.heap);
  }

  public store(assetname: AssetName, data: JSONObject): Promise<void> {
    this.heap[assetname] = data;
    return Promise.resolve();
  }

  public retrieve(assetname: AssetName): Promise<JSONObject> {
    return Promise.resolve(this.heap[assetname]);
  }

  public names(): Promise<AssetNames> {
    return Promise.resolve(Object.keys(this.heap));
  }
}
