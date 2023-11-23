import {
  assert,
  assertAlmostEquals,
  assertEquals,
  assertInstanceOf,
} from "assert";
import { DataSet, Grid } from "./grid.ts";

Deno.test("Empty initialization", () => {
  const g = new Grid(new DataSet(0));
  assertInstanceOf(g, Grid);
});

Deno.test("Optimize Zero Items", () => {
  const g = new Grid(new DataSet(0));
  g.optimize();
  assertEquals(g.displacement, 0);
});

Deno.test("Optimize One Item", () => {
  const g = new Grid(new DataSet(1));
  g.optimize();
  assertEquals(g.displacement, 0);
});

Deno.test("Optimize Two Items", () => {
  const g = new Grid(new DataSet(2));
  const before = g.displacement;
  g.optimize();
  const after = g.displacement;
  assert(before >= after);
  assertAlmostEquals(g.displacement, Math.sqrt(2), 0.1);
});

Deno.test("Optimize Three Items", () => {
  const g = new Grid(new DataSet(3));
  g.optimize();
  assert(g.displacement > Math.sqrt(2));
});

Deno.test("Optimize Many Items", () => {
  const g = new Grid(new DataSet(1000));
  g.optimize();
  assert(g.displacement > 50);
});

Deno.test("Visualize before and after", () => {
  const g = new Grid(new DataSet(10));
  g.print();
  g.optimize();
  g.print();
});
