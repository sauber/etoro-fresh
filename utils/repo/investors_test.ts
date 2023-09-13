import { assertEquals, assertInstanceOf } from "assert";
import { Repo } from "./repo.ts";
import { Investors } from "./investors.ts";
import { username, cis } from "./testdata.ts";

Deno.test("Investors", async (t) => {
  const repo = await Repo.tmp();
  const investors: Investors = new Investors(repo);
  assertInstanceOf(investors, Investors);
  assertEquals(investors.length, 0)

  await t.step("add investor", () => {
    investors.add(username, cis);
    assertEquals(investors.length, 1);
  });

  await t.step("add same investor again", () => {
    investors.add(username, cis);
    assertEquals(investors.length, 1);
  });

  await repo.delete();
});

