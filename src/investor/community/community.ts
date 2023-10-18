import { Repo } from "/repository/mod.ts";

export type Names = string[];


/** Use cases for list of investors */
export class Community {
  constructor(private readonly repo: Repo) {}

  async refresh(_callback: ()=>void): Promise<void> {
    // Load/refresh discover
    // Load/refresh user
    // Extract name+cid
    // Foreach name+cid load/refresh chart, portfolio, stats
  }

  /*
  async last(): Promise<Names> {
    const date = await this.repo.end();
    const names = this.repo.assets('stats') as Names;
    return names;
  }
  */
}