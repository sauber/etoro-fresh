import { assertEquals, assertInstanceOf } from "assert";
import { HeapRepo } from "./repo-heap.ts";
import { today, DateFormat } from "/infrastructure/time/calendar.ts";
import { JSONObject } from "./repo.d.ts";

Deno.test("Initialization", () => {
  const repo = new HeapRepo();
  assertInstanceOf(repo, HeapRepo);
});

Deno.test("Store and retrive objects", async (t) => {
  const repo = new HeapRepo();
  const date: DateFormat = today();
  const assetname = 'foo';
  const data: JSONObject = { bar: true };

  await t.step("Store", async () => {
    await repo.store(assetname, data);
  });

  await t.step("Retrive", async () => {
    const response: JSONObject = await repo.retrieve(assetname);
    assertEquals(response, data);
  });

  await t.step("Search for dates", async() => {
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
});

