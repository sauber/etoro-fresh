import { assert } from "assert";

export interface StatsData {
  Data: {
    CustomerId: number,
    UserName: string
  }
}

export class Stats {
  constructor(private readonly raw: StatsData) {}

  public validate(): boolean {
    assert(this.raw.Data.CustomerId, `CustomerId missing`);
    return true;
  }
}
