import { assertEquals, assertInstanceOf } from "$std/assert/mod.ts";
import { DateFormat, today } from "📚/utils/time/mod.ts";
import { HeapBackend } from "📚/repository/heap-backend.ts";
import { Journal } from "📚/repository/journal.ts";
import { Asset } from "📚/repository/asset.ts";

const repo = new HeapBackend();

type TestAsset = {
  name: string,
  id: number
}

const name = 'foo';
const data: TestAsset = {name: 'bar', id: 1};

Deno.test("Initialization", () => {
  const journal: Journal = new Journal(repo);
  assertInstanceOf(journal, Journal);
});

Deno.test("Asset", async (t) => {
  const date: DateFormat = today();
  const journal: Journal = new Journal(repo);
  const asset: Asset<TestAsset> = journal.asset(name);
  assertInstanceOf(asset, Asset<TestAsset>);

  await t.step("Store", async () => {
    const result = await asset.store(data);
    assertEquals(result, undefined);
  });

  await t.step("Dates", async () => {
    assertEquals(await journal.dates(), [date]);
  });

  await t.step("End", async () => {
    assertEquals(await journal.end(), date);
  });

  await t.step("assetsbyDate", async () => {
    const result = await journal.assetsByDate(date);
    assertEquals(result, [name]);
  });

  await t.step("All Names", async () => {
    const result = await journal.names();
    assertEquals(result, [name]);
  });

});
