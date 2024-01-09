import {
  assertEquals,
  assertGreaterOrEqual,
  assertInstanceOf,
} from "$std/assert/mod.ts";
import { Investor } from "./investor.ts";
import { repoBackend } from "../repository/old/testdata.ts";
import { ChartSeries } from "./chart-series.ts";
import type { InvestorExport } from "./mod.ts";
import type { DateFormat } from "/utils/time/mod.ts";
import type { InvestorId } from "/investor/mod.ts";

// Test Data
const username = "FundManagerZech";
const CustomerId = 5125148;
const FullName = "Zheng Bin";

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

Deno.test("Start/End", async () => {
  const investor: Investor = new Investor(username, repoBackend);
  const start: DateFormat | null = await investor.start();
  assertEquals(start, "2021-12-29");
  const end: DateFormat | null = await investor.end();
  assertEquals(end, "2022-04-25");
  assertGreaterOrEqual(end, start);
});

Deno.test("Active Range", async () => {
  const investor: Investor = new Investor(username, repoBackend);
  const active: boolean = await investor.active("2021-12-30");
  assertEquals(active, true);
  const inactive: boolean = await investor.active("2021-12-28");
  assertEquals(inactive, false);
});

Deno.test("Validate", async () => {
  const investor: Investor = new Investor(username, repoBackend);
  const valid: boolean = await investor.isValid();
  assertEquals(valid, true);
});
