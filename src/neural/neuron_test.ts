import { assertEquals, assertInstanceOf } from "$std/assert/mod.ts";
import { Neuron, Scaler } from "./neuron.ts";
import { Value } from "./value.ts";

Deno.test("Initialize Neuron", () => {
  const n = new Neuron(0);
  assertInstanceOf(n, Neuron);
});

Deno.test("Initialize Scaler", () => {
  const n = new Scaler();
  assertInstanceOf(n, Scaler);
});

Deno.test("Scaling", () => {
  const n = new Scaler();

  // Scale 2 to 1
  const a = new Value(2);
  const o = n.forward(a);
  assertEquals(o.data, 1);

  // Scale 1 to 0.5
  const b = new Value(1);
  const p = n.forward(b);
  assertEquals(p.data, 0.5);
});
