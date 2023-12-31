import { assertInstanceOf, assertEquals } from "assert";
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
    assertEquals(df.length, 10);
  });
});
