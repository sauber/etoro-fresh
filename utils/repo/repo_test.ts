import { assert, assertEquals, assertInstanceOf, assertRejects } from "assert";
import { Repo, Config, JSONValue, Discover, DiscoverData } from "/utils/repo/repo.ts";

Deno.test("repo initialization", async () => {
  const repo: Repo = await Repo.tmp();
  assertInstanceOf(repo, Repo);
  await repo.delete();
});

Deno.test("Config", async (t) => {
  const repo = await Repo.tmp();
  const config: Config = repo.config;

  await t.step("latest", async () => {
    await assertRejects(
      () => {
        return config.latest();
      },
      Error,
      "File config.json not found"
    );
  });

  await t.step("get unknown value", async () => {
    const value: JSONValue = await config.get("foo");
    assertEquals(value, null);
  });

  /*
  await t.step("set and get value", async () => {
    await config.set("foo", "bar");
    const value: JSONValue = await config.get("foo");
    assertEquals(value, "bar");
  });
  */

  await repo.delete();
});

Deno.test("Discover", async (t) => {
  const repo = await Repo.tmp();
  const discover: Discover = repo.discover;

  await t.step("latest", async () => {
    await assertRejects(
      () => {
        return discover.latest();
      },
      Error,
      "File discover.json not found"
    );
  });

  await t.step("recent", async () => {
    const data: DiscoverData = await discover.recent();
    assert(data.TotalRows >= 70 && data.TotalRows <= 140);
  });

  await repo.delete();
});
