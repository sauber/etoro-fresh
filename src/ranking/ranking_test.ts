import { assertInstanceOf } from "assert";
import { community } from "./testdata.ts";
import { Ranking } from "./ranking.ts";
import { Names } from "/investor/mod.ts";

Deno.test("Initialization", () => {
  const rank = new Ranking(community);
  assertInstanceOf(rank, Ranking);
});

Deno.test("Names", async (t) => {
  const rank = new Ranking(community);
  
  await t.step("names", async () => {
    const names: Names = await rank.names();;
    console.log(names);
    //assertInstanceOf(names, string[]);
  });
});