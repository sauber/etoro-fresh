import { assertEquals } from "$std/assert/mod.ts";
import { ema, rsi, sma } from "./indicators.ts";

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

Deno.test("RSI", () => {
  const testData = [40, 42, 44, 40, 38, 42, 45, 48, 50];
  const windowSize = 5;

  const result = rsi(testData, windowSize);
  assertEquals(result, [
    65,
    76.76348547717842,
    84.55172413793103,
    88.4297520661157,
    100
  ]);
});
