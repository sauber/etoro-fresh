import { assertInstanceOf } from "assert";
import { Investor } from "./investor.ts";
import type { InvestorId } from "./repo.d.ts";
import { investorId } from "./testdata.ts";

Deno.test("Initialization", () => {
  const investor: Investor = new Investor(investorId);
  assertInstanceOf(investor, Investor);
});
