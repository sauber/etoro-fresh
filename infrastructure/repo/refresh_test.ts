import { assertInstanceOf, assertEquals } from "assert";
import { RepoTempBackend } from "./repo-temp.ts";
import { FetchHeapBackend } from "./fetch-heap.ts";
import { Refresh } from "./refresh.ts";
import { investorId, testAssets } from "./testdata.ts";

const fetcher: FetchHeapBackend = new FetchHeapBackend(testAssets);
const max = 1;

Deno.test("Initialize", async (t) => {
  const repo = new RepoTempBackend();
  const refresh: Refresh = new Refresh(repo, fetcher, investorId, max);
  assertInstanceOf(refresh, Refresh);
  await repo.delete();
});

/*
Deno.test("Fresh", async (t) => {
  const repo = new RepoTempBackend();
  const max = 1;

  await t.step("initialize", async () => {
    const refresh: Refresh = new Refresh(repo, investorId, max);
    assertInstanceOf(refresh, Refresh);
  });

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

  //await repo.delete();
});
*/