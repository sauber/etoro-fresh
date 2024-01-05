import { assertEquals } from "$std/assert/mod.ts";
import { RepoHeapBackend } from "./repo-heap.ts";
import { JSONValue } from "./mod.ts";
import { Config } from "./config.ts";

Deno.test("Config", async (t) => {
  const backend = new RepoHeapBackend();
  const config: Config = new Config(backend);

  await t.step("get unknown value", async () => {
    const value: JSONValue = await config.get("foo");
    assertEquals(value, null);
  });

  await t.step("set and get value", async () => {
    await config.set("foo", "bar");
    const value: JSONValue = await config.get("foo");
    assertEquals(value, "bar");
  });

  // Create new derived config object with defaults
  const configWithDefaults = config.withDefaults({ standard: "normal" });

  await t.step("set default", async () => {
    const value: JSONValue = await configWithDefaults.get("standard");
    assertEquals(value, "normal");
  });
});
