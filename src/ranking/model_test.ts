import { assertEquals, assertInstanceOf } from "assert";
import { RepoHeapBackend } from "/repository/repo-heap.ts";
import { Sequential, tensor1D } from "netsaur";
import { Model } from "./model.ts";

const repo: RepoHeapBackend = new RepoHeapBackend();

Deno.test("Initialize", () => {
  const model = new Model(repo);
  assertInstanceOf(model, Model);
});


Deno.test("Train model", { ignore: flase }, async () => {
  // Testdata
  // y1 = (2x - 1)/10
  // y2 = (x*x -1)/100
  const input: Array<Array<number>> = [[1], [2], [3], [4], [5]];
  const output: Array<[number, number]> = [
    [0.1, 0],
    [0.3, 0.03],
    [0.5, 0.08],
    [0.7, 0.15],
    [0.9, 0.24]
  ];

  // Sequential model
  const model = new Model(repo);
  //const seq = model.createModel();

  // Training
  const done = await model.train(seq, input, output);
  assertEquals(done, undefined);

  // Validate
  for (let i = 0; i < input.length; i++) {
    const out = (await seq.predict(tensor1D(input[i]))).data;
    console.log(input[i], output[i], out.slice(0, 2));
  }
});

