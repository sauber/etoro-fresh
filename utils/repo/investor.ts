import { Repo } from "./repo.ts";
import { Portfolio } from "./portfolio.ts";
import { Stats } from "./stats.ts";
import { Chart } from "./chart.ts";

export class Investor {
  private readonly portfolio: Portfolio;
  private readonly stats: Stats;
  private readonly chart: Chart;

  constructor(private readonly repo: Repo, private readonly username: string, private readonly cis: number) {
    this.portfolio = new Portfolio(repo, username, cis);
    this.stats = new Stats(repo, username, cis);
    this.chart = new Chart(repo, username, cis);
  }
}
