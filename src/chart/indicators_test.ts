import { assertEquals } from "$std/assert/mod.ts";
import { sma, ema } from "./indicators.ts";

Deno.test("SMA", () => {
  const testData = [10, 20, 30, 40, 50, 60];
  const result = sma(testData, 3);
  assertEquals(result, [20, 30, 40, 50]);
});

Deno.test("EMA", () => {
  const testData = [10, 20, 30, 40, 50, 60];
  const result = ema(testData, 3);
  assertEquals(result, [10, 15, 22.5, 31.25, 40.625, 50.3125]);
});
