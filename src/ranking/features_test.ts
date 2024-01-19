import { assertEquals, assertInstanceOf } from "$std/assert/mod.ts";
import { community } from "./testdata.ts";
import { Features } from "./features.ts";
import { DataFrame } from "/utils/dataframe.ts";

Deno.test("Initialization", () => {
  const rank = new Features(community);
  assertInstanceOf(rank, Features);
});

Deno.test("DataFrame", async (t) => {
  const rank = new Features(community);

  await t.step("data", async () => {
    const df: DataFrame = await rank.data();
    //df.include(["PopularInvestor", "Gain", "Profit"]).print("Features");
    assertEquals(df.length, 10);
  });
});
