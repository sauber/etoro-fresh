import { assertEquals, assertInstanceOf } from "$std/assert/mod.ts";
import type { DateFormat } from "📚/time/mod.ts";
import { nextDate } from "📚/time/mod.ts";
import { Portfolio } from "./portfolio.ts";
import type { Positions } from "./portfolio.ts";
import { investor, position } from "./testdata.ts";

const chart = investor.chart;
const start: DateFormat = chart.start;
const end: DateFormat = chart.end;
const first: number = chart.first;
const last: number = chart.last;
const amount: number = position.amount;

Deno.test("Instance", () => {
  const p = new Portfolio();
  assertInstanceOf(p, Portfolio);
});

Deno.test("Add position", () => {
  const p = new Portfolio();
  p.add(position);
});

Deno.test("Remove position", () => {
  const p = new Portfolio();
  p.add(position);
  assertEquals(p.length, 1);
  p.remove(position);
  assertEquals(p.length, 0);
});

Deno.test("Aggregated Profit", () => {
  const p = new Portfolio();
  assertEquals(p.profit(end), 0);
  p.add(position);
  p.add(position);
  assertEquals(p.profit(start), 0);
  const actual_profit: number = p.profit(end);
  const expected_profit: number = 2 * (last / first - 1) * amount;
  assertEquals(actual_profit, expected_profit);
});

Deno.test("Expiration", () => {
  const p = new Portfolio();
  p.add(position);
  const late: DateFormat = nextDate(end);
  const expired: Positions = p.expired(late);
  assertEquals(expired.length, 1);
  assertEquals(p.length, 1);
});
