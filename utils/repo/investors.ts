import { Repo } from "./repo.ts";
import { Investor } from "./investor.ts";

export class Investors {
  private readonly list: Record<string, Investor> = {};

  constructor(private readonly repo: Repo) {}

  get length(): number { return Object.keys(this.list).length}

  add(username: string, cis: number): void {
    if ( ! this.list[username] )
      this.list[username] = new Investor(this.repo, username, cis)
  }
}
