import { assertInstanceOf, assertEquals } from "assert";
import { TempRepo } from "./repo-temp.ts";
import { Refresh } from "./refresh.ts";
import { config } from "./testdata.ts";

Deno.test("Fresh", async (t) => {
  const repo = new TempRepo();
  const max = 1;
  const username = await config.get("UserName") as string;
  const cid = await config.get("CustomerId") as number;

  const refresh: Refresh = new Refresh(repo, username, cid, max);
  assertInstanceOf(refresh, Refresh);

  await t.step("fetch all", async () => {
    const count: number = await refresh.run();
    console.log(`Fetch data for ${count} investors`);
    assertEquals(count, max);
  });

  await t.step("fetch again", async () => {
    const count: number = await refresh.run();
    console.log(`Fetch data for ${count} investors`);
    assertEquals(count, max);
  });

  await repo.delete();
});