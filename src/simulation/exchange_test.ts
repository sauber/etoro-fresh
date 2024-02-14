import {
  assertAlmostEquals,
  assertEquals,
  assertInstanceOf,
  assertLess,
} from "$std/assert/mod.ts";
import { Position } from "./position.ts";
import type { DateFormat } from "📚/utils/time/mod.ts";
import { Exchange } from "./exchange.ts";
import { chart, username } from "./testdata.ts";

// Position data
const start: DateFormat = chart.start;
const end: DateFormat = chart.end;
const first: number = chart.first;
const last: number = chart.last;

// Exchange property
const spread = 0.02;
const amount = 1000;

Deno.test("Instance", () => {
  const ex = new Exchange();
  assertInstanceOf(ex, Exchange);
});

Deno.test("Pricing", () => {
  const ex = new Exchange(spread);
  assertEquals(ex.buying_price(amount), amount * (1 + spread));
  assertAlmostEquals(ex.selling_price(amount), amount * (1 - spread));
});

Deno.test("Buy and Sell", () => {
  const ex = new Exchange(spread);
  const pos: Position = ex.buy(start, username, chart, amount);

  // Buying
  const buying_price: number = first * (1 + spread);
  const opening_value: number = (amount * first) / buying_price;
  assertLess(opening_value, amount);
  assertAlmostEquals(pos.value(start), opening_value);

  //Selling
  const actual_payout: number = ex.sell(end, pos);
  const selling_price: number = last * (1 - spread);
  const nominal_value: number = pos.value(end);
  const closing_value: number = (nominal_value * selling_price) / last;
  assertAlmostEquals(actual_payout, closing_value);
  assertLess(closing_value, nominal_value);
});
