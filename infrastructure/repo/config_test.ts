import { assertEquals } from "assert";

import { TempRepo } from "./repo-temp.ts";
import { JSONValue } from "./repo.d.ts";
import { Config } from "./config.ts";

Deno.test("Config", async (t) => {
  const repo = new TempRepo();
  const config: Config = new Config(repo);

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
