import { assertInstanceOf } from "assert";
import { Investor } from "./investor.ts";
import { investorId } from "/refresh/testdata.ts";

Deno.test("Initialization", () => {
  const investor: Investor = new Investor(investorId);
  assertInstanceOf(investor, Investor);
});
