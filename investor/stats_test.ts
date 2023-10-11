import { assertInstanceOf, assertEquals } from "assert";
import { Repo } from "./repo.ts";
import { Stats, StatsData } from "./stats.ts";
import { username, cid } from "./testdata.ts";

Deno.test("Stats", async (t) => {
  const repo = await Repo.tmp();
  const stats: Stats = new Stats(repo, username, cid);
  assertInstanceOf(stats, Stats);

  await t.step("recent", async () => {
    const data: StatsData = await stats.recent();
    assertEquals(data.Data.UserName, username);
    assertEquals(data.Data.CustomerId, cid);
  });

  await repo.delete();
});