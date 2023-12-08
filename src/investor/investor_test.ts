import { assertEquals, assertInstanceOf } from "assert";
import { Investor } from "./investor.ts";
import { repoBackend } from "/repository/testdata.ts";
import { Asset } from "/repository/mod.ts";
import { ChartSeries } from "./chart-series.ts";
import type {
  ChartData,
  InvestorExport,
  PortfolioData,
  StatsData,
} from "./mod.ts";
import type { DateFormat } from "/utils/time/mod.ts";
import type { InvestorId } from "/investor/mod.ts";

const username = "FundManagerZech";
const CustomerId = 5125148;
const FullName = "Zheng Bin";

/*
const charts = repoBackend.asset(username + ".chart") as Asset<ChartData>;
const portfolios = repoBackend.asset(
  username + ".portfolio",
) as Asset<PortfolioData>;
const stats = repoBackend.asset(username + ".stats") as Asset<StatsData>;
*/

Deno.test("Blank Initialization", () => {
  const investor: Investor = new Investor(username, repoBackend);
  assertInstanceOf(investor, Investor);
});

Deno.test("Chart Series", async () => {
  const investor: Investor = new Investor(username, repoBackend);
  const series: ChartSeries = await investor.chart();
  assertEquals(series.start(), "2020-12-01");
  assertEquals(series.values.length, 511);
});

Deno.test("Combined Export", async () => {
  const investor: Investor = new Investor(username, repoBackend);
  const dump: InvestorExport = await investor.export();
  assertInstanceOf(dump.chart[0], Array<DateFormat>);
  assertInstanceOf(dump.chart[1], Array<number>);
  assertInstanceOf(dump.mirrors, Array<InvestorId>);
  assertInstanceOf(dump.stats, Object);
  assertEquals(dump.stats.UserName, username);
});

Deno.test("CustomerId", async () => {
  const investor: Investor = new Investor(username, repoBackend);
  const id: number = await investor.CustomerId();
  assertEquals(id, CustomerId);
});

Deno.test("Full Name", async () => {
  const investor: Investor = new Investor(username, repoBackend);
  const name: string = await investor.FullName();
  assertEquals(name, FullName);
});
