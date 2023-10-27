import { Semaphore } from "semaphore";

export class RateLimit {
  private available: Date = new Date();
  private semaphore = new Semaphore(1);

  /** rate is number of milliseconds since start of previous call */
  constructor(private readonly rate: number) {}

  /** What for a period of time */
  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public async limit(callback: () => unknown) {
    return await this.semaphore.use(async () => {
      // How many ms until timeout
      const now: Date = new Date();
      const wait: number = this.available.getTime() - now.getTime();
      if (wait > 0) {
        //console.log("waiting", wait, "ms");
        await this.delay(wait);
      }

      // Next time to run
      const next = this.available.getTime() + this.rate;
      this.available = new Date(next);
      //console.log('Next run: ', this.rate, next, this.available);

      // Executing callback and return result
      return callback();
    });
  }

}
