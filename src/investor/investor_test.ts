import { assertInstanceOf } from "$std/assert/mod.ts";
import { Investor } from "./investor.ts";
import { Chart } from "../chart/mod.ts";

const username = "john123";
const id = 1;
const fullname = "John Doe";
const chart = new Chart([10000], "2022-10-10");

Deno.test("Blank Initialization", () => {
  const investor = new Investor(username, id, fullname, chart);
  assertInstanceOf(investor, Investor);
});
