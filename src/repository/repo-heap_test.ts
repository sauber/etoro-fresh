import {
  assertEquals,
  assertNotEquals,
  assertInstanceOf,
  assert,
} from "$std/assert/mod.ts";
import { RepoHeapBackend } from "./repo-heap.ts";
import { today, DateFormat } from "/utils/time/mod.ts";
import { JSONObject } from "./mod.ts";

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

  await t.step("End date", async () => {
    const date: DateFormat | null = await repo.end();
    assertEquals(date, null);
  });
});

Deno.test("Store and retrive objects", async (t) => {
  const repo = new RepoHeapBackend();
  const date: DateFormat = today();
  const assetname = "foo";
  const data: JSONObject = { bar: true };

  await t.step("Lookup", async () => {
    const exists: boolean = await repo.has(assetname);
    assertEquals(exists, false);
  });

  await t.step("Store", async () => {
    await repo.store(assetname, data);
  });

  await t.step("Retrieve", async () => {
    const response = (await repo.retrieve(assetname)) as JSONObject;
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
    const ms: number | null = await repo.age(assetname);
    assertNotEquals(ms, null);
    if (ms != null)
      assert(ms > 0 && ms < 1000, `Age should be 0-1000ms, is ${ms}ms`);
  });

  await t.step("End date", async () => {
    const date: DateFormat | null = await repo.end();
    assertEquals(date, today());
  });

  await t.step("Delete", async () => {
    await repo.delete();
  });
});
