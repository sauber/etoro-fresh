import { assertEquals, assertInstanceOf } from "@std/assert";
import { TrainingData } from "📚/ranking/trainingdata.ts";
import { community } from "📚/ranking/testdata.ts";
import type { Inputs, Outputs } from "📚/ranking/mod.ts";

Deno.test("Instance", () => {
  const t = new TrainingData(community);
  assertInstanceOf(t, TrainingData);
});

Deno.test("Generate data", async () => {
  const t = new TrainingData(community);
  await t.load();
  const inputs: Inputs = t.inputs;
  const outputs: Outputs = t.outputs;
  assertEquals(inputs.length, 19);
  assertEquals(outputs.length, 19);
});
