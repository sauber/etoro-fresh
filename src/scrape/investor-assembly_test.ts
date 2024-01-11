import {
  assertEquals,
  assertGreater,
  assertInstanceOf,
  assertNotEquals,
} from "$std/assert/mod.ts";
//import { DateFormat } from "📚/utils/time/mod.ts";
import { InvestorAssembly } from "./investor-assembly.ts";
import type { MirrorsByDate, StatsByDate } from "./investor-assembly.ts";

import { InvestorId } from "📚/scrape/mod.ts";
import { repo } from "./testdata.ts";
// import { ChartSeries } from "./chart-series.ts";
// import type { InvestorExport } from "./mod.ts";
// import type { DateFormat } from "/utils/time/mod.ts";
// import type { InvestorId } from "/investor/mod.ts";

// Test Data
const username = "FundManagerZech";
const CustomerId = 5125148;
//const FullName = "Zheng Bin";

Deno.test("Blank Initialization", () => {
  const investor: InvestorAssembly = new InvestorAssembly(username, repo);
  assertInstanceOf(investor, InvestorAssembly);
});

Deno.test("Chart", async () => {
  const investor = new InvestorAssembly(username, repo);
  const series: number[] = await investor.chart();
  assertEquals(series.length, 511);
  assertEquals(series[0], 6443.72);
  assertEquals(series[series.length - 1], 11044);
});

Deno.test("Start", async () => {
  const investor = new InvestorAssembly(username, repo);
  assertEquals(await investor.start(), "2020-12-01");
});

Deno.test("End", async () => {
  const investor = new InvestorAssembly(username, repo);
  assertEquals(await investor.end(), "2022-04-25");
});

Deno.test("UserName", () => {
  const investor = new InvestorAssembly(username, repo);
  const name: string = investor.UserName;
  assertEquals(name, username);
});

Deno.test("CustomerId", async () => {
  const investor = new InvestorAssembly(username, repo);
  assertEquals(await investor.CustomerId(), CustomerId);
});

Deno.test("Stats", async () => {
  const investor = new InvestorAssembly(username, repo);
  const stats: StatsByDate = await investor.stats();
  assertEquals(Object.keys(stats), [
    "2021-12-29",
    "2022-01-21",
    "2022-04-18",
    "2022-04-25",
  ]);
});

Deno.test("Mirrors", async () => {
  const investor = new InvestorAssembly("Schnaub123", repo);
  const mirrors: MirrorsByDate = await investor.mirrors();
  assertEquals(Object.keys(mirrors), [
    "2022-02-05",
    "2022-02-12",
    "2022-04-18",
    "2022-04-25",
  ]);

  // Confirm at least one mirror each date
  // Confirm mirrors have UserName
  Object.values(mirrors).forEach((ids: InvestorId[]) => {
    assertGreater(ids.length, 0);
    ids.forEach((id: InvestorId) => assertNotEquals(id.UserName, ""));
  });
});

// Deno.test("Combined Export", async () => {
//   const investor: Investor = new InvestorAssembly(username, repoBackend);
//   const dump: InvestorExport = await investor.export();
//   assertInstanceOf(dump.chart[0], Array<DateFormat>);
//   assertInstanceOf(dump.chart[1], Array<number>);
//   assertInstanceOf(dump.mirrors, Array<InvestorId>);
//   assertInstanceOf(dump.stats, Object);
//   assertEquals(dump.stats.UserName, username);
// });
