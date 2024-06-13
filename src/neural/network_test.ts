import { assertEquals, assertInstanceOf, assertNotEquals } from "$std/assert/mod.ts";
// import { stringify } from "$std/yaml/mod.ts";
import { Network, NetworkData } from "./network.ts";

Deno.test("Initialize", () => {
  assertInstanceOf(new Network(0), Network);
});

Deno.test("No layers", () => {
  const n = new Network(0);
  const input = [1, 2];
  const output: number[] = n.predict([1, 2]);
  assertEquals(input, output);
});

Deno.test("Add Dense Layer", () => {
  const n = new Network(0);
  const d: Network = n.dense(0);
  const output: number[] = d.predict([]);
  assertEquals(output, []);
});

Deno.test("Hidden and output layer", () => {
  const n = new Network(2);
  const d: Network = n.dense(2).dense(1);
  const output: number[] = d.predict([0, 0]);
  assertEquals(output.length, 1);
  assertNotEquals(output[0], 0);
});

Deno.test("Import/export", () => {
  const n: Network = new Network(2).dense(1).relu;
  const e: NetworkData = n.export;
  // console.log(stringify(e));
  const i: Network = Network.import(e);
  const e2: NetworkData = i.export;
  assertEquals(e, e2);
});

Deno.test("XOR testing", () => {
  const n: Network = new Network(2).dense(1).relu;
  const e: NetworkData = n.export;
  // console.log(stringify(e));
  const i: Network = Network.import(e);
  const e2: NetworkData = i.export;
  assertEquals(e, e2);
});


