import { assertEquals, assertInstanceOf } from "assert";
import { Investor } from "./investor.ts";
import { ChartData } from "./chart.ts";
import { PortfolioData } from "./portfolio.ts";
import { StatsData } from "./stats.ts";
import { repoBackend } from "/repository/testdata.ts";
import { Asset } from "/repository/mod.ts";
import { ChartSeries } from "./chart-series.ts";

const charts = repoBackend.asset("FundManagerZech.chart") as Asset<ChartData>;
const portfolios = repoBackend.asset("FundManagerZech.portfolio") as Asset<PortfolioData>;
const stats = repoBackend.asset("FundManagerZech.stats") as Asset<StatsData>;

Deno.test("Blank Initialization", () => {
  const investor: Investor = new Investor(charts, portfolios, stats);
  assertInstanceOf(investor, Investor);
});

Deno.test("Chart Series", async () => {
  const investor: Investor = new Investor(charts, portfolios, stats);
  const series: ChartSeries = await investor.chartAssembly();
  assertEquals(series.start(),  "2020-12-01");
  assertEquals(series.values.length,  511);
});
