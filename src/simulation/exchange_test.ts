import { assertInstanceOf, assertEquals, assertAlmostEquals } from "assert";
import { Position } from "./position.ts";
import type { DateFormat } from "/utils/time/mod.ts";
import { Exchange } from "./exchange.ts";
import { community, username, chart } from "./testdata.ts";

// Position data
const start: DateFormat = chart.start();
const end: DateFormat = chart.end();
const first: number = chart.first();
const last: number = chart.last();

// Exchange property
const spread = 0.02;
const amount = 1000;

Deno.test("Instance", () => {
  const ex = new Exchange(community);
  assertInstanceOf(ex, Exchange);
});

Deno.test("Buy and Sell", async () => {
  const ex = new Exchange(community, spread);
  const pos: Position = await ex.buy(username, start, amount);

  // Buying
  const expected_value: number = amount - amount * spread;
  assertEquals(pos.value(start), expected_value);

  //Selling
  const actual_payout: number = ex.sell(pos, end);
  const opening_value: number = amount - amount * spread;
  const closing_value: number = (last / first) * opening_value;
  const closing_fee: number = closing_value * spread;
  const expected_payout: number = closing_value - closing_fee;
  assertAlmostEquals(actual_payout, expected_payout);
});
