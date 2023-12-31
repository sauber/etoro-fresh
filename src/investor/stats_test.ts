import { assertEquals } from "assert";
import { Stats } from "./stats.ts";
import { statsData } from "./testdata.ts";

Deno.test("Validate", () => {
  const stats: Stats = new Stats(statsData);
  assertEquals(stats.validate(), true);
});
