import { assertEquals, assertInstanceOf } from "assert";
import { TempRepo } from "./repo-temp.ts";
import { JSONObject } from "./repo.d.ts";

Deno.test("Initialization", async () => {
  const repo = new TempRepo();
  assertInstanceOf(repo, TempRepo);
  await repo.delete();
});

Deno.test("Asset", async (t) => {
  const repo = new TempRepo();
  const asset = "config";
  const referenceData = {};

  await t.step("file does not exist yet", async () => {
    const data: JSONObject | null = await repo.last(asset);
    assertEquals(data, null);
  });

  await t.step("write", async () => {
    await repo.store(asset, referenceData);
  });

  await t.step("read", async () => {
    const data: JSONObject | null = await repo.last(asset);
    assertEquals(data, referenceData);
  });

  await repo.delete();
});
