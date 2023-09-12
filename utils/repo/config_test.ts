import { assertEquals, assertRejects } from "assert";

import { Repo } from "./repo.ts";
import { JSONValue } from "./asset.ts";
import { Config } from "./config.ts";

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
