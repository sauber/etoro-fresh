import { assertEquals, assertInstanceOf } from "assert";
import { DataFrame } from "./dataframe.ts";

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
  assertInstanceOf(df, DataFrame);
  assertEquals(df.series("b").values, [true, false]);
  const e = df.records;
  assertEquals(testdata, e);
});

Deno.test("Select", () => {
  const df = DataFrame.fromRecords(testdata);
  const cols = ["s", "n"];
  const sel = df.select(cols);
  assertEquals(sel.names, cols);
});
