import { assert, assertEquals, assertInstanceOf } from "$std/assert/mod.ts";
import { Portfolio } from "./portfolio.ts";
import { IPolicy, Policy } from "./policy.ts";
import type { Conviction } from "./policy.ts";
import { Order } from "./order.ts";
import type { BuyItems } from "./order.ts";
import { community } from "./testdata.ts";
import { Chart } from "📚/chart/mod.ts";
import { DateFormat } from "📚/time/mod.ts";
import { DataFrame } from "📚/utils/dataframe.ts";

// const portfolio = new Portfolio();
// const cash = 100000;
// const targets = 10;
// const chart = investor.chart;

const start: DateFormat = "2021-12-29";
const end: DateFormat = "2022-04-25";
const name = "FundManagerZech";
const investor = await community.investor(name);

const empty: IPolicy = {
  portfolio: new Portfolio(),
  chart: new Chart([], start),
  investors: [],
  conviction: {},
  date: start,
  cash: 0,
  targets: 0,
};

Deno.test("Instance", () => {
  const p = new Policy(empty);
  assertInstanceOf(p, Policy);
});

Deno.test("Empty Data", () => {
  const p = new Policy(empty);
  const buy: BuyItems = p.buy;
  assertEquals(buy.length, 0);
});

Deno.test("Buy 100% of investor with positive rank", () => {
  const positive = Object.assign({}, empty, {
    investors: [investor],
    conviction: { [name]: 1 },
    cash: 10000,
  });
  const p = new Policy(positive);
  const buy: BuyItems = p.buy;
  assertEquals(buy.length, 1);
  assertEquals(buy, [{investor: investor, date: start, amount: 10000 }]);
});


Deno.test("Buy 0% of investor with negative rank", () => {
  const positive = Object.assign({}, empty, {
    investors: [investor],
    conviction: { [name]: -1 },
    cash: 10000,
  });
  const p = new Policy(positive);
  const buy: BuyItems = p.buy;
  assertEquals(buy.length, 0);
});

// Deno.test("Buy max 0 targets", () => {
//   const zero = Object.assign({}, empty, {
//     investors: [investor],
//     conviction: { [name]: 1 },
//     cash: 10000,
//   });
//   const p = new Policy(zero);
//   const buy: BuyItems = p.buy;
//   assertEquals(buy.length, 0);
// });



// Deno.test("Run", () => {
//   const p = new Policy(args);
//   const o: Order = p.run();
//   assert( "buy" in o);
//   assert("sell" in o);
//   console.log(o);
// });

/** Test scenarios:
 * No portfolio, no investors: Buy nothing and sell nothing
 * No portfolio, one investor, perfect timing: Invest 100% in investor
 */
