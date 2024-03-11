import { assertEquals, assertInstanceOf } from "$std/assert/mod.ts";
import { Portfolio } from "./portfolio.ts";
import { IPolicy, Policy } from "./policy.ts";
import { conviction, date, investors } from "./testdata.ts";

const portfolio = new Portfolio();
const cash = 100000;
const targets = 10;

const args: IPolicy = {
  investors,
  portfolio,
  conviction,
  date,
  cash,
  targets,
};

Deno.test("Instance", () => {
  const p = new Policy(args);
  assertInstanceOf(p, Policy);
});

Deno.test("ranking", () => {
  const p = new Policy(args);
  const t = p.target;
  assertEquals(Object.entries(t).length, 6);
  //console.log(t);
});
