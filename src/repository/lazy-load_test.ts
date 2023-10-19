import { LazyLoad } from "./lazy-load.ts";
import { assertEquals } from "assert";
import { JSONObject } from "./mod.ts";

Deno.test("Blank callback", async () => {
  const value = {};
  const asset = new LazyLoad(
    () => new Promise<JSONObject>((resolve) => resolve(value))
  );
  const result = await asset.value();
  assertEquals(result, value);
});
