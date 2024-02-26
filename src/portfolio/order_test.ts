import { assertInstanceOf } from "$std/assert/mod.ts";
import { investor, position } from "./testdata.ts";
import { Order } from "./order.ts";

Deno.test("Instance", () => {
  const o = new Order();
  assertInstanceOf(o, Order);
});

Deno.test("Buy", () => {
  const o = new Order();
  o.buy.push({ investor, date: investor.chart.start, amount: 1000 });
});

Deno.test("Sell", () => {
  const o = new Order();
  o.sell.push({ position, reason: "test" });
});
