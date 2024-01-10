import {
  assertEquals,
  assertInstanceOf,
} from "$std/assert/mod.ts";
//import { DateFormat } from "📚/utils/time/mod.ts";
import { InvestorAssembly } from "./investor-assembly.ts";
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
  const stats = await investor.stats();
  assertEquals(Object.keys(stats), [
    "2021-12-29",
    "2022-01-21",
    "2022-04-18",
    "2022-04-25",
  ]);
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

// Deno.test("CustomerId", async () => {
//   const investor: Investor = new InvestorAssembly(username, repoBackend);
//   const id: number = await investor.CustomerId();
//   assertEquals(id, CustomerId);
// });

// Deno.test("Full Name", async () => {
//   const investor: Investor = new InvestorAssembly(username, repoBackend);
//   const name: string = await investor.FullName();
//   assertEquals(name, FullName);
// });

// Deno.test("Start/End", async () => {
//   const investor: Investor = new InvestorAssembly(username, repoBackend);
//   const start: DateFormat | null = await investor.start();
//   assertEquals(start, "2021-12-29");
//   const end: DateFormat | null = await investor.end();
//   assertEquals(end, "2022-04-25");
//   assertGreaterOrEqual(end, start);
// });

// Deno.test("Active Range", async () => {
//   const investor: Investor = new InvestorAssembly(username, repoBackend);
//   const active: boolean = await investor.active("2021-12-30");
//   assertEquals(active, true);
//   const inactive: boolean = await investor.active("2021-12-28");
//   assertEquals(inactive, false);
// });

// Deno.test("Validate", async () => {
//   const investor: Investor = new InvestorAssembly(username, repoBackend);
//   const valid: boolean = await investor.isValid();
//   assertEquals(valid, true);
// });
