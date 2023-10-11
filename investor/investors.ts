import { Repo } from "./repo.ts";
import { Investor } from "./investor.ts";

export class Investors {
  private readonly list: Record<string, Investor> = {};

  constructor(private readonly repo: Repo) {}

  get length(): number { return Object.keys(this.list).length}

  add(username: string, cis: number): Investor {
    if ( ! this.list[username] )
      this.list[username] = new Investor(this.repo, username, cis)
    return this.list[username];
  }

  /** Combine with investors from other list */
  extend(other: Investors): void {
    for ( const inv of other.all ) {
      this.add(inv.username, inv.cid);
    }
  }

  get all(): Investor[] {
    return Object.values(this.list);
  }
}
