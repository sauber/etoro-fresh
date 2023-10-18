import { Asset } from "./asset.ts";
import { assertEquals } from "assert";
import { JSONObject } from "./mod.ts";

Deno.test("Blank callback", async () => {
  const asset = new Asset(() =>
    new Promise<JSONObject>((resolve) => resolve({}))
  );
  const result = await asset.value();
  assertEquals(result, {});
});
