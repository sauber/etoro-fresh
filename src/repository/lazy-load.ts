import { JSONObject } from "./mod.ts";

/** Lazy load and cache result og callback */
export class LazyLoad {
  private cache: null | JSONObject = null;

  constructor(private readonly callback: () => Promise<JSONObject|null>) {}

  /** Run callback and cache results */
  async value(): Promise<JSONObject|null> {
    if (!this.cache) this.cache = await this.callback();
    return this.cache;
  }
}
