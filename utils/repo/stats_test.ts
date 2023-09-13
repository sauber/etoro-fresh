import { assertInstanceOf, assertEquals } from "assert";
import { Repo } from "./repo.ts";
import { Stats, StatsData } from "./stats.ts";

Deno.test("Stats", async (t) => {
  const repo = await Repo.tmp();
  const username = "JeppeKirkBonde";
  const cis = 2988943;
  const stats: Stats = new Stats(repo, username, cis);
  assertInstanceOf(stats, Stats);

  await t.step("recent", async () => {
    const data: StatsData = await stats.recent();
    assertEquals(data.Data.UserName, username);
    assertEquals(data.Data.CustomerId, cis);
  });

  await repo.delete();
});