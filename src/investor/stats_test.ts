import { assertEquals, assertInstanceOf } from "assert";
import { Stats } from "./stats.ts";
import { statsData } from "./testdata.ts";

Deno.test("Stats", async (t) => {
  await t.step("validate", async () => {
    const stats: Stats = new Stats(statsData);
    assertEquals(stats.validate(), true);
  });
});
