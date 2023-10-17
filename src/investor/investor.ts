/*
import { Repo } from "./repo.ts";
import { Portfolio } from "./portfolio.ts";
import { Stats } from "./stats.ts";
import { Chart } from "./chart.ts";
*/
import type { InvestorId } from "./investor.d.ts";

export class Investor {
  constructor(private readonly id: InvestorId) {}
/*
  readonly portfolio: Portfolio;
  readonly stats: Stats;
  readonly chart: Chart;

  constructor(private readonly repo: Repo, readonly username: string, readonly cid: number) {
    this.portfolio = new Portfolio(repo, username, cid);
    this.stats = new Stats(repo, username, cid);
    this.chart = new Chart(repo, username, cid);
  }
*/
}
