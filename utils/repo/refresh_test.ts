import { assertInstanceOf, assertEquals } from "assert";
import { Repo } from "./repo.ts";
import { Refresh } from "./refresh.ts";
import { username, cid } from "./testdata.ts";

Deno.test("Fresh", async (t) => {
  const repo = await Repo.tmp();
  const max = 0;
  const refresh: Refresh = new Refresh(repo, username, cid, max);
  assertInstanceOf(refresh, Refresh);

  await t.step("fetch all", async () => {
    const count: number = await refresh.run();
    console.log(`Fetch data for ${count} investors`);
    assertEquals(count, max);
  });

  //await repo.delete();
});