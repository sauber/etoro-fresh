import { assertEquals, assertInstanceOf } from "$std/assert/mod.ts";
import type { DateFormat } from "/utils/time/mod.ts";
import { today } from "📚/utils/time/mod.ts";
import { HeapBackend } from "📚/repository/mod.ts";
import { Asset } from "./asset.ts";

type TestAsset = {
  name: string;
  id: number;
};

const content: TestAsset = {
  name: "foo",
  id: 1,
};

const repo = new HeapBackend();

Deno.test("Blank Initialization", () => {
  const series = new Asset("", repo);
  assertInstanceOf(series, Asset);
});

Deno.test("Store and retrieve asset", async (t) => {
  const asset = new Asset<TestAsset>("", repo);

  await t.step("No initial dates", async () => {
    assertEquals(await asset.dates(), []);
  });

  await t.step("Retrieve before defined", async () => {
    const last: TestAsset = await asset.last();
    assertEquals(last, undefined);
    assertEquals(await asset.dates(), []);
  });



  await t.step("Store data", async () => {
    const date: DateFormat = today();
    asset.store(content);
    assertEquals(await asset.dates(), [date]);
    assertEquals(await asset.start(), date);
    assertEquals(await asset.end(), date);
    assertEquals(await asset.first(), content);
    assertEquals(await asset.last(), content);
    assertEquals(await asset.before(date), content);
    assertEquals(await asset.after(date), content);
  });
});
