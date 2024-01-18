import { assertEquals, assertInstanceOf } from "$std/assert/mod.ts";
import { Asset } from "📚/storage/mod.ts";
import { Community } from "./community.ts";
import { HeapBackend } from "/storage/heap-backend.ts";
import { today } from "/utils/time/mod.ts";

Deno.test("Initialization", () => {
  const repo = new HeapBackend();
  const community: Community = new Community(repo);
  assertInstanceOf(community, Community);
});

Deno.test("Latest Names", async (t) => {
  const repo = new HeapBackend();
  const community: Community = new Community(repo);
  const name = "john";
  const date = today();

  await t.step("incomplete write", async () => {
    await Promise.all([
      new Asset(`${name}.chart`, repo).store({}),
      new Asset(`${name}.portfolio`, repo).store({}),
    ]);
    const names = await community.names(date);
    assertEquals(names.values, [name]);
  });

  await t.step("complete write", async () => {
    await new Asset(`${name}.stats`, repo).store({});
    const names = await community.names(date);
    assertEquals(names.values, [name]);
  });

  await t.step("all names", async () => {
    const names = await community.names();
    assertEquals(names.values, [name]);
  });

  await t.step("last date", async () => {
    const d = await community.end();
    assertEquals(d, date);
  });
});
