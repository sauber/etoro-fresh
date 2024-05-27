import {
  assertEquals,
  assertGreaterOrEqual,
  assertInstanceOf,
  assertNotEquals,
} from "$std/assert/mod.ts";
import { v } from "./value.ts";
import { Dense, Network, Neuron, Relu } from "./network.ts";

// Neuron

Deno.test("Neuron Initialize", () => {
  const n = new Neuron(0);
  assertInstanceOf(n, Neuron);
});

Deno.test("Neuron Parameters", () => {
  const n = new Neuron(1);
  const p = n.parameters();
  assertEquals(p.length, 2);
});

Deno.test("Neuron Pretty Print", { ignore: true }, () => {
  const n = new Neuron(2);
  n.print();
});

Deno.test("Neuron Activation", () => {
  const n = new Neuron(1);
  const predict = n.forward([v(5)]);
  // predict.print();
  assertNotEquals(predict.data, 0);
});

// Dense Layer

Deno.test("Dense Layer Initialize", () => {
  const l = new Dense(0, 0);
  assertInstanceOf(l, Dense);
});

Deno.test("Dense Layer Activation", () => {
  // Zero inputs = bias
  const l = new Dense(0, 1);
  const predict = l.forward([]);
  assertNotEquals(predict[0].data, 0);
});

Deno.test("Dense Layer Print", () => {
  const l = new Dense(0, 3);
  // l.print();
});

// Relu Layer

Deno.test("Rely Layer Initialize", () => {
  const l = new Relu();
  assertInstanceOf(l, Relu);
});

Deno.test("Rely Layer Activation", () => {
  const l = new Relu();
  const cases = [
    [-1, 0],
    [0, 0],
    [1, 1],
  ];
  cases.forEach((c) => {
    const predict = l.forward([v(c[0])]);
    assertEquals(predict[0].data, c[1]);
  });
  l.print();
});

// Network of Layers

Deno.test("Network Initialize", () => {
  const n = new Network([]);
  assertInstanceOf(n, Network);
});

Deno.test("Network Activation", () => {
  const n = new Network([
    new Dense(0, 1),
    new Relu(),
  ]);
  // console.log("Network");
  // n.print();
  // console.log("Prediction");
  const predict = n.forward([]);
  // predict[0].print();
  assertGreaterOrEqual(predict[0].data, 0);
});
