import { assertInstanceOf } from "assert";
import { community } from "./testdata.ts";
import { Ranking } from "./ranking.ts";

Deno.test("Initialization", () => {
  const rank = new Ranking(community);
  assertInstanceOf(rank, Ranking);
});

Deno.test("Features", async (t) => {
  const rank = new Ranking(community);

  await t.step("data", async () => {
    const [input, output] = await rank.data();
    assertInstanceOf(input, Array);
    assertInstanceOf(output, Array);
  });
});
