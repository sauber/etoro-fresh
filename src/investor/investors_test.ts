import { assertEquals, assertInstanceOf } from "assert";
import { Investors } from "./investors.ts";
import { investorId } from "./testdata.ts";

Deno.test("Investors", async (t) => {
  const investors: Investors = new Investors();
  assertInstanceOf(investors, Investors);
  assertEquals(investors.length, 0)

  await t.step("add investor", () => {
    investors.add(investorId);
    assertEquals(investors.length, 1);
  });

  await t.step("add same investor again", () => {
    investors.add(investorId);
    assertEquals(investors.length, 1);
  });
});

