import { Repo } from "./repo.ts";
import { Portfolio } from "./portfolio.ts";
import { Stats } from "./stats.ts";
import { Chart } from "./chart.ts";

export interface InvestorData {
  CustomerId: number;
  UserName: string;
}

export class Investor {
  private readonly portfolio: Portfolio;
  private readonly stats: Stats;
  private readonly chart: Chart;

  constructor(private readonly repo: Repo, private readonly username: string, private readonly cid: number) {
    this.portfolio = new Portfolio(repo, username, cid);
    this.stats = new Stats(repo, username, cid);
    this.chart = new Chart(repo, username, cid);
  }
}
