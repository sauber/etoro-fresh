import { assertEquals, assertInstanceOf } from "$std/assert/mod.ts";
import { Position } from "./position.ts";
import type { DateFormat } from "/utils/time/mod.ts";
import { nextDate } from "/utils/time/mod.ts";
import { chart, username as name } from "./testdata.ts";

const open: DateFormat = chart.start();
const expire: DateFormat = chart.end();
const first: number = chart.first();
const last: number = chart.last();
const amount = 1000;

Deno.test("Instance", () => {
  const pos = new Position(open, name, chart, first, amount);
  assertInstanceOf(pos, Position);
});

Deno.test("Profit", () => {
  const pos = new Position(open, name, chart, first, amount);
  const actual_profit = pos.profit(expire);
  const expected_profit = (last / first - 1) * amount;
  assertEquals(actual_profit, expected_profit);
});

Deno.test("Value", () => {
  const pos = new Position(open, name, chart, first, amount);
  const actual_value = pos.value(expire);
  const expected_value = amount + (last / first - 1) * amount;
  assertEquals(actual_value, expected_value);
});

Deno.test("Expire", () => {
  const pos = new Position(open, name, chart, first, amount);
  const within: boolean = pos.valid(expire);
  assertEquals(within, true);
  const beyond: boolean = pos.valid(nextDate(expire));
  assertEquals(beyond, false);
});
