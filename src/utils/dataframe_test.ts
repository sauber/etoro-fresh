import { assertEquals, assertInstanceOf } from "$std/assert/mod.ts";
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
  assertEquals(df.column("b").values, [true, false]);
  const e = df.records;
  assertEquals(testdata, e);
});

Deno.test("Print as Table", { ignore: true }, () => {
  const df = DataFrame.fromRecords(testdata);
  assertEquals(df.print(), undefined, "Without Title");
  assertEquals(df.print("Test Title"), undefined, "With Title");
});

Deno.test("Grid", () => {
  const df = DataFrame.fromRecords(testdata);
  const g: SeriesTypes[][] = df.grid;
  //console.log(g);
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

Deno.test("Correlation Matrix", () => {
  function r() {
    return Math.round(10 * Math.random());
  }

  const i = DataFrame.fromRecords([
    { i1: r(), i2: r(), i3: r() },
    { i1: r(), i2: r(), i3: r() },
    { i1: r(), i2: r(), i3: r() },
  ]);

  const o = DataFrame.fromRecords([
    { o1: r(), o2: r() },
    { o1: r(), o2: r() },
    { o1: r(), o2: r() },
  ]);

  const c = i.correlationMatrix(o);
  assertEquals(c.column("Keys").values, ["i1", "i2", "i3"]);
  //c.digits(2).print("Pearson Correlation Coefficients Matrix");
});

Deno.test("Sorting", () => {
  const testdata = [{ k: 2 }, { k: 1 }];
  const df = DataFrame.fromRecords(testdata);
  const sorted = df.sort("k");
  assertEquals(sorted.records, testdata.reverse());
});

Deno.test("Generate Column", () => {
  const df = DataFrame.fromRecords(testdata);
  const amend = df.amend("neg", (r) => (r.n !== undefined ? -r.n : undefined));
  assertEquals(amend.column("neg").values, [-1, -2]);
});

Deno.test("Reverse Rows", () => {
  const df = DataFrame.fromRecords(testdata);
  const rev = df.reverse;
  assertEquals(rev.column("n").values, [1, 2]);
});

Deno.test("Reduce Rows", () => {
  const df = DataFrame.fromRecords(testdata);
  const rev = df.slice(0, 1);
  assertEquals(rev.records, [testdata[0]]);
});

Deno.test("Filter Rows", () => {
  const df = DataFrame.fromRecords(testdata);
  const rev = df.select((r) => r.b);
  assertEquals(rev.records, [testdata[0]]);
});

Deno.test("Rename Columns", () => {
  const df = DataFrame.fromRecords(testdata);
  const mv = df.rename({ s: "t", b: "c" });
  assertEquals(mv.names, ["n", "t", "c"]);
});
