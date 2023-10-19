/*
import { Repo } from "./repo.ts";
import { Portfolio } from "./portfolio.ts";
import { Stats } from "./stats.ts";
import { Chart } from "./chart.ts";
*/
import type { InvestorId } from "./mod.ts";
import { DateSeries } from "/repository/date-series.ts";

export class Investor {
  constructor(
    private readonly chartSeries: DateSeries,
    private readonly portfolioSeries: DateSeries,
    private readonly statsSeries: DateSeries,
  ) {}
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
