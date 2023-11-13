import { assertEquals, assertInstanceOf } from "assert";
import { BoolSeries, Series, TextSeries } from "./series.ts";

Deno.test("Numbers", () => {
  const s = new Series();
  assertInstanceOf(s, Series);
});

Deno.test("Text", () => {
  const s = new TextSeries();
  assertInstanceOf(s, TextSeries);
});

Deno.test("First and last", () => {
  const s = new Series([10, 20]);
  assertEquals(s.first, 10);
  assertEquals(s.last, 20);
});

Deno.test("Correlation", () => {
  const tests: Array<[Array<number>, Array<number>, number]> = [
    [[1, 2, 3], [1, 2, 3], 1],
    [[1, 2, 3], [3, 2, 1], -1],
    [[1, 2, 3], [1, 3, 2], 0.5],
    [[1, 2, 3], [3, 1, 2], -0.5],
  ];
  for (const t of tests) {
    const s = new Series(t[0]);
    const o = new Series(t[1]);
    assertEquals(s.correlation(o), t[2]);
  }
});
