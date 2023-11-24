import { assertEquals, assertInstanceOf } from "assert";
import { RepoHeapBackend } from "/repository/repo-heap.ts";
import { Model } from "./model.ts";
import type { Input, Output } from "./model.ts";

const repo: RepoHeapBackend = new RepoHeapBackend();

// Testdata
// y1 = (2x - 1)/10
// y2 = (x*x -1)/100
const input: Input = [[1], [2], [3], [4], [5]];
const output: Output = [
  [0.1, 0],
  [0.3, 0.03],
  [0.5, 0.08],
  [0.7, 0.15],
  [0.9, 0.24],
];

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
