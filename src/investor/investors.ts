import { InvestorId } from "./investor.d.ts";

export class Investors {
  private readonly list: Record<string, InvestorId> = {};

  constructor() {}

  get length(): number { return Object.keys(this.list).length}

  add(investor: InvestorId): void {
    const id = investor.CustomerId;
    if ( ! this.list[id] )
      this.list[id] = investor;
  }

  /** Combine with investors from other list */
  extend(other: Investors): void {
    for ( const investor of other.all ) {
      this.add(investor);
    }
  }

  get all(): InvestorId[] {
    return Object.values(this.list);
  }
}
