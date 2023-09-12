import { Repo } from "./repo.ts";

export class Investor {
  readonly filename = null;

  constructor(private readonly repo: Repo, private readonly name: string) {
    //this.portfolio = new Portfolio(repo, name);
    //this.stats = new Stats(repo, name);
    //this.chart = new Chart(repo, name);
  }
}
