import { assert } from "assert";
import type { InvestorId } from "/investor/investor.d.ts";

export type DiscoverData = {
  Status: string;
  TotalRows: number;
  Items: InvestorId[];
}

export class Discover {
  constructor(private readonly raw: DiscoverData) {}

  public validate(): boolean {
    assert(this.raw.TotalRows >= 1, `TotalRows ${this.raw.TotalRows} < 1`);
    return true;
  }

  public get investors(): InvestorId[] {
    return this.raw.Items;
  }

  public get count(): number {
    return this.raw.TotalRows;
  }
}
