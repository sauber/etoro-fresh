import { Semaphore } from "semaphore";
import { JSONObject }  from "./asset.ts";

export class Fetcher {
  private available: Date = new Date();
  private semaphore = new Semaphore(1);

  constructor(private callbackDelayMs: number = 10000) {}

  private  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async limit(callback: () => Promise<JSONObject>) {
    return await this.semaphore.use(async () => {
      // How many ms until timeout
      const now: Date = new Date();
      const wait: number = this.available.getTime() - now.getTime();
      if (wait > 0) {
        //console.log('waiting', wait);
        await this.delay(wait);
      }

      // Next time to run
      const next = new Date().getTime() + this.callbackDelayMs;
      this.available = new Date(next);

      // Execute the callback
      return await callback();
    });
  }

  private fetchjson(url: string): Promise<JSONObject> {
    return fetch(url, {
      headers: {
        accept: "application/json",
      },
    }).then((resp) => resp.json());
  }

/** Wrap fetch call in limit */
  async get(url: string): Promise<JSONObject> {
    let data: JSONObject;

    const data3: JSONObject = await this.limit(async (): Promise<JSONObject> => {
      data = await this.fetchjson(url) as JSONObject;
      return data;
    });

    const data2 = data3;
    return data2;
  }
}