import { assertEquals, assertInstanceOf } from "$std/assert/mod.ts";
import { RepoHeapBackend } from "/repository/repo-heap.ts";
import { Model } from "./model.ts";
import { DataFrame } from "/utils/dataframe.ts";
import type { RowRecords } from "/utils/dataframe.ts";

const repo: RepoHeapBackend = new RepoHeapBackend();

// Testdata
const keys = [...Array(26)].map((_, i) =>
  String.fromCharCode("A".charCodeAt(0) + i)
);
const r: RowRecords = [];
for (let i = 1; i <= 5; i++) {
  const s = Object.fromEntries(keys.map((key) => [key, i]));
  r.push(s);
}
const input: DataFrame = DataFrame.fromRecords(r);

// y1 = (2x - 1)/10
// y2 = (x*x -1)/100
const output: DataFrame = DataFrame.fromRecords([
  { l: 0.1, e: 0 },
  { l: 0.3, e: 0.03 },
  { l: 0.5, e: 0.08 },
  { l: 0.7, e: 0.15 },
  { l: 0.8, e: 0.24 },
]);

Deno.test("Initialize", () => {
  const model = new Model(repo);
  assertInstanceOf(model, Model);
});

Deno.test("Train", { ignore: false }, async () => {
  const model = new Model(repo);

  // Training
  const done = await model.train(input, output);
  assertEquals(done, undefined);
});

Deno.test("Validate", { ignore: false }, async () => {
  const model = new Model(repo);

  // Validate
  const out = await model.predict(input);
  //console.log(out);
  assertEquals(input.length, out.length);
});
