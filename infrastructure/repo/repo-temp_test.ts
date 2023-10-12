import { assertEquals, assertInstanceOf } from "assert";
import { RepoTempBackend } from "./repo-temp.ts";
import { JSONObject, RepoBackend } from "./repo.d.ts";

Deno.test("Initialization", async () => {
  const repo = new RepoTempBackend();
  assertInstanceOf(repo, RepoTempBackend);
  await repo.delete();
});

Deno.test("Asset", async (t) => {
  const repo = new RepoTempBackend();
  const asset = "config";
  const referenceData = {};

  await t.step("file does not exist yet", async () => {
    const data: JSONObject | null = await repo.retrieve(asset);
    assertEquals(data, null);
  });

  await t.step("write", async () => {
    await repo.store(asset, referenceData);
  });

  await t.step("read", async () => {
    const data: JSONObject | null = await repo.retrieve(asset);
    assertEquals(data, referenceData);
  });

  await repo.delete();
});
