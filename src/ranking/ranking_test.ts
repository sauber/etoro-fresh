import { assertEquals, assertInstanceOf } from "assert";
import { community } from "./testdata.ts";
import { Ranking } from "./ranking.ts";

Deno.test("Initialization", () => {
  const rank = new Ranking(community);
  assertInstanceOf(rank, Ranking);
});

Deno.test("Features", { ignore: true }, async (t) => {
  const rank = new Ranking(community);

  await t.step("data", async () => {
    const [input, output] = await rank.data();
    assertInstanceOf(input, Array);
    assertInstanceOf(output, Array);
    assertEquals(input.length, output.length);
  });
});

Deno.test("DataFrames", async (t) => {
  const rank = new Ranking(community);

  await t.step("data", async () => {
    const df = await rank.data();
    //console.log(df);
    //console.log(df.length);
    assertEquals(df.length, 19);
  });
});
