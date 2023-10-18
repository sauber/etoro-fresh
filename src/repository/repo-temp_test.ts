import { assertEquals, assertNotEquals, assertInstanceOf, assert } from "assert";
import { RepoTempBackend } from "./repo-temp.ts";
import { JSONObject } from "./mod.ts";

Deno.test("Initialization", async (t) => {
  const repo = new RepoTempBackend();
  assertInstanceOf(repo, RepoTempBackend);

  await t.step("delete", async() =>{
    await repo.delete();
  });
});

Deno.test("Asset", async (t) => {
  const repo = new RepoTempBackend();
  const assetname = "config";
  const referenceData = {};

  await t.step("file does not exist yet", async () => {
    const data: JSONObject | null = await repo.retrieve(assetname);
    assertEquals(data, null);
  });

  await t.step("write", async () => {
    await repo.store(assetname, referenceData);
  });

  await t.step("read", async () => {
    const data: JSONObject | null = await repo.retrieve(assetname);
    assertEquals(data, referenceData);
  });

  await t.step("age", async () => {
    const ms: number | null = await repo.age(assetname);
    assertNotEquals(ms, null);
    if ( ms != null )
      assert(ms > 1 && ms < 1000, `Age should be 1-1000ms, is ${ms}ms`);
  });
  
  await t.step("write", async () => {
    await repo.delete();
  });
});
