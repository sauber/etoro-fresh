import { assert, assertEquals, assertInstanceOf } from "$std/assert/mod.ts";
import { Portfolio } from "./portfolio.ts";
import { IPolicy, Policy } from "./policy.ts";
import { Order } from "./order.ts";
import { conviction, date, investor, investors, position } from "./testdata.ts";

const portfolio = new Portfolio().add(position);
const cash = 100000;
const targets = 10;
const chart = investor.chart;

const args: IPolicy = {
  portfolio,
  chart,
  investors,
  conviction,
  date,
  cash,
  targets,
};

Deno.test("Instance", () => {
  const p = new Policy(args);
  assertInstanceOf(p, Policy);
});

Deno.test("Run", () => {
  const p = new Policy(args);
  const o: Order = p.run();
  assert( "buy" in o);
  assert("sell" in o);
  console.log(o);
});
