import { Inputs, Outputs, TrainingData } from "📚/ranking/trainingdata.ts";
import { community } from "📚/ranking/testdata.ts";
import { assertInstanceOf } from "$std/assert/assert_instance_of.ts";
import { assertEquals } from "$std/assert/assert_equals.ts";

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