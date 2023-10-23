import { Semaphore } from "semaphore";
import type { FetchBackend } from "./mod.ts";
import { Config, JSONObject, JSONValue } from "/repository/mod.ts";

export class FetchRateLimitingBackend implements FetchBackend {
  private available: Date = new Date();
  private semaphore = new Semaphore(1);
  private static defaults: Record<string, JSONValue> = {
    fetch_delay: 5000,
  };
  readonly config: Config;

  constructor(config: Config) {
    this.config = config.withDefaults(FetchRateLimitingBackend.defaults);
  }

  /** Extract from config or defaults how much time between each request */
  private callbackDelayMs: null|number = null;
  private async rate(): Promise<number> {
    if ( ! this.callbackDelayMs ) {
      this.callbackDelayMs = await this.config.get('fetch_delay') as number;
      if ( ! this.callbackDelayMs || this.callbackDelayMs < 100 )
        throw new Error(`Delay is ${this.callbackDelayMs}`);
    }
    return this.callbackDelayMs;
  }

  /** What for a period of time */
  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async limit(callback: () => Promise<JSONObject>) {
    return await this.semaphore.use(async () => {
      // How many ms until timeout
      const now: Date = new Date();
      const wait: number = this.available.getTime() - now.getTime();
      if (wait > 0) {
        console.log("fetch waiting", wait, "ms");
        await this.delay(wait);
      }

      // Next time to run
      const next = this.available.getTime() + await this.rate();
      this.available = new Date(next);
      //console.log('Next run: ', this.callbackDelayMs, next, this.available);

      // Execute the callback
      return await callback();
    });
  }

  private fetchjson(url: string): Promise<JSONObject> {
    console.log("Fetch", url);

    return fetch(url, {
      headers: {
        accept: "application/json",
      },
    }).then((resp) => resp.json());
  }

  /** Wrap fetch call in limit */
  // TODO: Too many data objects used
  public async get(url: string): Promise<JSONObject> {
    let data: JSONObject;

    const data3: JSONObject = await this.limit(
      async (): Promise<JSONObject> => {
        data = (await this.fetchjson(url)) as JSONObject;
        return data;
      }
    );

    const data2 = data3;
    return data2;
  }
}
