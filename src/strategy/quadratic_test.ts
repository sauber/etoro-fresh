import { assertAlmostEquals } from "$std/assert/mod.ts";
import { peak } from "./quadratic.ts";

Deno.test("Quadratic Regression Peak", () => {
  const testData = [40, 42, 44, 40, 38, 42, 45, 48, 50];
  const x = [...Array(testData.length).keys()];
  const p = peak(x, testData);
  assertAlmostEquals(p.x, 2.32, 0.1);
  assertAlmostEquals(p.y, 40.30, 0.01);
});
