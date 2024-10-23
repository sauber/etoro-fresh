import type { NetworkData } from "@sauber/neurons";
import {
  assertEquals,
  assertGreater,
  assertInstanceOf,
  assertLessOrEqual,
  assertNotEquals,
} from "@std/assert";
import { Model } from "📚/ranking/model.ts";
import type { Input, Inputs, Output, Outputs } from "./mod.ts";
import { input_labels } from "📚/ranking/mod.ts";

/** Generate a random set of inputs */
function set(): Input {
  return Array.from({ length: input_labels.length }, Math.random) as Input;
}

/** Number of input features */
const features = input_labels.length;

Deno.test("Generate", () => {
  assertInstanceOf(Model.generate(features), Model);
});

Deno.test("Export / Import", () => {
  const m = Model.generate(features);
  const e: NetworkData = m.export();
  assertEquals(e.layers.length, 6);
  assertEquals(e.inputs, features);
  const i = Model.import(e);
  assertInstanceOf(i, Model);
});

Deno.test("Train", () => {
  const m = Model.generate(features);
  const inputs: Inputs = [set(), set(), set(), set()];
  const outputs: Outputs = [[0], [1], [1], [0]];
  const max = 2000;
  const results = m.train(inputs, outputs, max);
  assertGreater(results.iterations, 0);
  assertLessOrEqual(results.iterations, max);
});

Deno.test("Predict", () => {
  const m = Model.generate(features);
  const input: Input = set();
  const output: Output = m.predict(input);
  assertNotEquals(output[0], 0);
});
