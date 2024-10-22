import type { NetworkData, Outputs } from "@sauber/neurons";
import {
  assertEquals,
  assertGreater,
  assertInstanceOf,
  assertLessOrEqual,
  assertNotEquals,
} from "$std/assert/mod.ts";
import { Model } from "📚/ranking/model_neurons.ts";

Deno.test("Generate", () => {
  assertInstanceOf(Model.generate(2), Model);
});

Deno.test("Export / Import", () => {
  const m = Model.generate(2);
  const e: NetworkData = m.export();
  assertEquals(e.layers.length, 6);
  assertEquals(e.inputs, 2);
  const i = Model.import(e);
  assertInstanceOf(i, Model);
});

Deno.test("Train", () => {
  const m = Model.generate(2);
  const inputs = [[0, 0], [0, 1], [1, 0], [1, 1]];
  const outputs = [[0], [1], [1], [0]];
  const max = 2000;
  const iterations = m.train(inputs, outputs, max);
  assertGreater(iterations, 0);
  assertLessOrEqual(iterations, max);
});

Deno.test("Predict", () => {
  const m = Model.generate(2);
  const inputs = [[0, 0], [0, 1], [1, 0], [1, 1]];
  const outputs: Outputs = m.predict(inputs);
  assertEquals(outputs.length, inputs.length);
  outputs.forEach((r) => assertNotEquals(r[0], 0));
});
