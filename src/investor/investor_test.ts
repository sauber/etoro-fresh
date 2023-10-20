import { assertInstanceOf } from "assert";
import { Investor } from "./investor.ts";
import { ChartData } from "./chart.ts";
import { PortfolioData } from "./portfolio.ts";
import { StatsData } from "./stats.ts";
import { repoBackend } from "/repository/testdata.ts";
import { Asset } from "/repository/mod.ts";

const charts = repoBackend.asset("chart") as Asset<ChartData>;
const portfolios = repoBackend.asset("portfolio") as Asset<PortfolioData>;
const stats = repoBackend.asset("stats") as Asset<StatsData>;

Deno.test("Blank Initialization", () => {
  const investor: Investor = new Investor(charts, portfolios, stats);
  assertInstanceOf(investor, Investor);
});
