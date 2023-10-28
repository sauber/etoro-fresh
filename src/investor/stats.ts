import { assert } from "assert";
import { InvestorId } from "./mod.ts";

export type StatsExport = Record<
  string,
  string | number | boolean | Array<number>
>;

export type StatsData = {
  Data: InvestorId;
};

export class Stats {
  constructor(private readonly raw: StatsData) {}

  /** Confirm stats include CustomerId */
  public validate(): boolean {
    assert(this.raw.Data.CustomerId, `CustomerId missing`);
    return true;
  }

  /** Export essential data */
  public export(): StatsExport {
    return this.raw.Data;
  }
}
