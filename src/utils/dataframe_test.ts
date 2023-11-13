import { assertEquals, assertInstanceOf } from "assert";
import { DataFrame } from "./dataframe.ts";
import type { SeriesTypes } from "/utils/series.ts";

const testdata = [
  { n: 1, s: "a", b: true },
  { n: 2, s: "b", b: false },
];

Deno.test("Empty initialization", () => {
  const df = new DataFrame();
  assertInstanceOf(df, DataFrame);
});

Deno.test("Import and export records", () => {
  const df = DataFrame.fromRecords(testdata);
  assertEquals(df.series("b").values, [true, false]);
  const e = df.records;
  assertEquals(testdata, e);
});

Deno.test("Grid", () => {
  const df = DataFrame.fromRecords(testdata);
  const g: SeriesTypes[][] = df.grid;
  console.log(g);
  assertEquals(g[0][0], 1);
});


Deno.test("Include Columns", () => {
  const df = DataFrame.fromRecords(testdata);
  const cols = ["s", "n"];
  const sel = df.include(cols);
  assertEquals(sel.names, cols);
});

Deno.test("Exclude columns", () => {
  const df = DataFrame.fromRecords(testdata);
  const cols = ["s", "n"];
  const sel = df.exclude(cols);
  assertEquals(sel.names, ["b"]);
});
