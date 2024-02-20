import { assertEquals } from "$std/assert/mod.ts";
import { sma } from "./sma.ts";

Deno.test("SMA", () => {
  const testData = [10, 20, 30, 40, 50, 60];
  const result = sma(testData, 3);
  assertEquals(result, [20, 30, 40, 50]);
});
