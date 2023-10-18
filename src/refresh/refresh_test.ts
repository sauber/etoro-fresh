import { assertInstanceOf, assertEquals } from "assert";
import { FetchHeapBackend } from "./fetch-heap.ts";
import { Refresh } from "./refresh.ts";
import { investorId, testAssets, discoverOptions } from "./testdata.ts";
import { RepoHeapBackend } from "/repository/repo-heap.ts";

Deno.test("Initialize", async () => {
  const repo: RepoHeapBackend = new RepoHeapBackend();
  const fetcher: FetchHeapBackend = new FetchHeapBackend({});
  const refresh: Refresh = new Refresh(repo, fetcher, investorId, discoverOptions);
  assertInstanceOf(refresh, Refresh);
  await repo.delete();
});

Deno.test("Fresh", async (t) => {
  const repo = new RepoHeapBackend();
  const fetcher: FetchHeapBackend = new FetchHeapBackend(testAssets);
  const max = 3;

  await t.step("fetch all", async () => {
    const refresh = new Refresh(repo, fetcher, investorId, discoverOptions);
    const count: number = await refresh.run(max);
    //console.log(`Fetch data for ${count} investors`);
    // three downloads from own invester + 2x3 from mirrors + 1 discover = 10
    assertEquals(count, 1 + 3*max + 3);
  });

  await t.step("fetch again", async () => {
    const refresh = new Refresh(repo, fetcher, investorId, discoverOptions);
    const count: number = await refresh.run(max);
    //console.log(`Fetch data for ${count} investors`);
    assertEquals(count, max + 1, 'Expired charts will try download again');
  });

  await repo.delete();
});
