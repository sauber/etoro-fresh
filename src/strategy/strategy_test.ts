import { assertEquals, assertInstanceOf } from "$std/assert/mod.ts";
import { NullStrategy, RandomStrategy, Strategy } from "./strategy.ts";
import { Order } from "./order.ts";
import { Portfolio } from "./portfolio.ts";
import { investor, investors } from "./testdata.ts";

const date = investor.chart.start;
const portfolio: Portfolio = new Portfolio();

Deno.test("Strategy Instance", () => {
  const s = new Strategy(investors);
  assertInstanceOf(s, Strategy);
});

Deno.test("Null Strategy", () => {
  const s = new NullStrategy(investors);
  assertEquals(s.order(portfolio, date).buy.length, 0);
});

Deno.test("Random Strategy", () => {
  const amount = 1000;
  const s = new RandomStrategy(investors, amount);
  const order: Order = s.order(portfolio, date);
  assertEquals(order.buy.length, 1);
  assertEquals(order.buy[0].amount, amount);
});
