import { assertEquals, assertInstanceOf } from "$std/assert/mod.ts";
import {
  ExitStrategy,
  NullStrategy,
  RandomStrategy,
  Strategy,
} from "./strategy.ts";
import { Order } from "./order.ts";
import { Portfolio } from "./portfolio.ts";
import { investor, community, position } from "./testdata.ts";

const investors = await community.all();
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

Deno.test("Exit Strategy", () => {
  const portfolio = new Portfolio();
  portfolio.add(position);
  const s = new ExitStrategy(investors);
  const order: Order = s.order(portfolio, date);
  assertEquals(order.sell.length, 1);
  assertEquals(order.sell[0].reason, "exit");
  assertEquals(order.sell[0].position, position);
});
