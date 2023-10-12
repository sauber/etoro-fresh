import { JSONObject } from "./repo.d.ts";
import type { DateFormat } from "../time/calendar.ts";

/** Abstract class definition for a Repo class */
export abstract class Repo {
  //public refresh(callback: ()=>void): Promise<void> {} // Make data up-to-date
  //end(): Promise<Date> {} // Last date in repo
  //names(date? Date): Promise<Names> {} // Names on date, default end date
  //getInstruments(date? Date): Promise<Instruments> {} // Instruments
  //config(date? Date): Promise<Instruments> {}
  //investor(name, date?: Date) Promise<Investor> {}

  //abstract store()

  /** Throw and error */
  protected error(msg: string): Promise<void> {
    throw new Error("Error: " + msg);
  }

  // An async do-nothing function */
  protected silent(): Promise<void> {
    return new Promise((resolve) => resolve());
  }

  /** Delete whole repo */
  public abstract delete(): Promise<void>;

  /** Dates */
  public abstract dates(): Promise<DateFormat[]>;
  public async end(): Promise<DateFormat> {
    const dates: DateFormat[] = await this.dates();
    return dates.reverse()[0];
  };

  /** Assets */
  protected abstract assetNames(date: DateFormat): Promise<string[]>;

  /** Config object */
  public abstract setConfig(data: JSONObject): Promise<void>;
  public abstract getConfig(): Promise<JSONObject>;
}
