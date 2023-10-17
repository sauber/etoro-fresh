import { assertEquals, assertNotEquals, assertInstanceOf, assert } from "assert";
import { RepoHeapBackend } from "./repo-heap.ts";
import { today, DateFormat } from "/infrastructure/time/calendar.ts";
import { JSONObject } from "./repo.d.ts";

Deno.test("Initialization", () => {
  const repo = new RepoHeapBackend();
  assertInstanceOf(repo, RepoHeapBackend);
});

Deno.test("Empty repo", async (t) => {
  const repo = new RepoHeapBackend();
  const date: DateFormat = today();
  const assetname = "foo";

  await t.step("Search for dates", async () => {
    const dates: DateFormat[] = await repo.dates();
    assertEquals(dates, []);
  });

  await t.step("Search for dates by asset", async () => {
    const dates: DateFormat[] = await repo.datesByAsset(assetname);
    assertEquals(dates, []);
  });

  await t.step("Search for assets by dates", async () => {
    const response: string[] = await repo.assetsByDate(date);
    assertEquals(response, []);
  });
});

Deno.test("Store and retrive objects", async (t) => {
  const repo = new RepoHeapBackend();
  const date: DateFormat = today();
  const assetname = "foo";
  const data: JSONObject = { bar: true };

  await t.step("Store", async () => {
    await repo.store(assetname, data);
  });

  await t.step("Retrive", async () => {
    const response = await repo.retrieve(assetname) as JSONObject;
    assertEquals(response, data);
  });

  await t.step("Search for dates", async () => {
    const dates: DateFormat[] = await repo.dates();
    assertEquals(dates, [date]);
  });

  await t.step("Search for dates by asset", async () => {
    const dates: DateFormat[] = await repo.datesByAsset(assetname);
    assertEquals(dates, [date]);
  });

  await t.step("Search for assets by dates", async () => {
    const response: string[] = await repo.assetsByDate(date);
    assertEquals(response, [assetname]);
  });

  await t.step("Age of most recent asset", async () => {
    const ms: number|null = await repo.age(assetname);
    assertNotEquals(ms, null);
    if ( ms != null )
      assert(ms > 0 && ms < 1000, `Age should be 0-1000ms, is ${ms}ms`);
  });

  await t.step("Delete", async () => {
    await repo.delete();
  });
});
