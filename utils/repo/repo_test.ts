import { assert, assertEquals, assertInstanceOf, assertRejects, assertNotEquals } from "assert";
import {
  Repo,
  Config,
  JSONValue,
  UUID,
  Discover,
  DiscoverData,
} from "/utils/repo/repo.ts";
import { join } from "https://deno.land/std@0.200.0/path/join.ts";
import { today } from "/utils/calendar.ts";

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

  await t.step("set and get value", async () => {
    await config.set("foo", "bar");
    const value: JSONValue = await config.get("foo");
    assertEquals(value, "bar");
  });

  await repo.delete();
});

Deno.test("UUID", async (t) => {
  const repo = await Repo.tmp();
  const uuid: UUID = repo.uuid;

  await t.step("get unknown value", async () => {
    const value: JSONValue = await uuid.latest();
    assertEquals(value, null);
  });

  let generated: string
  await t.step("generate value", async () => {
    const value: JSONValue = await uuid.recent();
    assertNotEquals(value, null);
    generated = value;
  });

  await t.step("confim value", async () => {
    const value: JSONValue = await uuid.latest();
    assertEquals(value, generated);
  });

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
