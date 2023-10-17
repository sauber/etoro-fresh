import { assertInstanceOf, assertEquals } from "assert";
import { Stats, StatsData } from "./stats.ts";
import { investorId, repoBackend } from "./testdata.ts";

Deno.test("Initialization", () => {
  const stats = new Stats({Data:{CustomerId: 0, UserName: ''}});
  assertInstanceOf(stats, Stats);
});

Deno.test("Stats", async (t) => {
  await t.step("validate", async () => {
    const data = await repoBackend.retrieve(investorId.UserName + '.stats') as unknown as StatsData;
    const stats: Stats = new Stats(data);
    assertEquals(stats.validate(), true);
 });
});