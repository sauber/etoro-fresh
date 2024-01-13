import { assertEquals, assertInstanceOf } from "$std/assert/mod.ts";
import { FetchHeapBackend } from "./fetch-heap.ts";
import { Refresh } from "./refresh.ts";
import { discoverFilter, investorId, testAssets } from "./testdata.ts";
import { HeapBackend } from "../storage/heap-backend.ts";

Deno.test("Initialize", () => {
  const repo: HeapBackend = new HeapBackend();
  const fetcher: FetchHeapBackend = new FetchHeapBackend(testAssets);
  const refresh: Refresh = new Refresh(
    repo,
    fetcher,
    investorId,
    discoverFilter
  );
  assertInstanceOf(refresh, Refresh);
});

Deno.test("Fresh", async (t) => {
  const repo = new HeapBackend();
  const fetcher: FetchHeapBackend = new FetchHeapBackend(testAssets);
  const max = 3;

  await t.step("fetch all", async () => {
    const refresh = new Refresh(repo, fetcher, investorId, discoverFilter);
    const count: number = await refresh.run(max);
    //console.log(`Fetch data for ${count} investors`);
    // three downloads from one invester + 2x3 from mirrors + 1 discover = 10
    assertEquals(count, 1 + 3 * max + 3);
  });

  await t.step("fetch again", async () => {
    const refresh = new Refresh(repo, fetcher, investorId, discoverFilter);
    const count: number = await refresh.run(max);
    //console.log(`Fetch data for ${count} investors`);
    assertEquals(count, max + 1, "Expired charts will try download again");
  });
});
