import { assertEquals, assertInstanceOf } from "$std/assert/mod.ts";
import { BoolSeries, ObjectSeries, Series, TextSeries } from "./series.ts";

Deno.test("Numbers", () => {
  const s = new Series();
  assertInstanceOf(s, Series);
});

Deno.test("Text", () => {
  const s = new TextSeries();
  assertInstanceOf(s, TextSeries);
});

Deno.test("Boolean", () => {
  const s = new BoolSeries();
  assertInstanceOf(s, BoolSeries);
});

Deno.test("Object", () => {
  const s = new ObjectSeries();
  assertInstanceOf(s, ObjectSeries);
});

Deno.test("First and last", () => {
  const s = new Series([10, 20]);
  assertEquals(s.first, 10);
  assertEquals(s.last, 20);
});

Deno.test("Any item", () => {
  const s = new Series([10]);
  assertEquals(s.any, 10);
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

Deno.test("Positive Numbers", () => {
  const s = new Series([-1, 1]);
  assertEquals(s.abs.values, [1, 1]);
});

Deno.test("Distribute Numbers", () => {
  const s = new Series([1, 4]);
  assertEquals(s.distribute.values, [0.2, 0.8]);
});
