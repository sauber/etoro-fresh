import { assertEquals, assertInstanceOf } from "assert";
import { community } from "./testdata.ts";
import { Ranking } from "./ranking.ts";
import { DataFrame } from "/utils/dataframe.ts";

Deno.test("Initialization", () => {
  const rank = new Ranking(community);
  assertInstanceOf(rank, Ranking);
});

Deno.test("DataFrame", async (t) => {
  const rank = new Ranking(community);

  await t.step("data", async () => {
    const df = await rank.data();
    assertEquals(df.length, 10);
  });
});
