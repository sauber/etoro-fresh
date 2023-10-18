import { assert } from "assert";
import { InvestorId } from "./mod.ts";

export type StatsData = {
  Data: InvestorId
}

export class Stats {
  constructor(private readonly raw: StatsData) {}

  public validate(): boolean {
    assert(this.raw.Data.CustomerId, `CustomerId missing`);
    return true;
  }
}
