import { assertEquals, assertInstanceOf } from "$std/assert/mod.ts";
import { Dense, LRelu, Network, Sigmoid } from "./micrograd.ts";
import { ScatterPlot } from "./scatter.ts";
import { Inputs, Outputs, Train } from "./train.ts";
import { printImage } from "terminal_images";

const network = new Network([
  new Dense(2, 3),
  new LRelu(),
  new Dense(3, 1),
  new Sigmoid(),
]);

// XOR training set
const xs: Inputs = [
  [0, 0],
  [0, 1],
  [1, 0],
  [1, 1],
];
const ys: Outputs = [
  [0],
  [1],
  [1],
  [0],
];

// Train network
const train = new Train(network, xs, ys);
train.epsilon = 0.001;
train.run(20000, 0.9);

Deno.test("Initialize", () => {
  const s = new ScatterPlot(network, xs, ys);
  assertInstanceOf(s, ScatterPlot);
});

Deno.test("Pixels", async () => {
  const s = new ScatterPlot(network, xs, ys);
  const size = 4;
  const p: Uint8Array = s.pixels(size);
  assertInstanceOf(p, Uint8Array);
  assertEquals(p.length, size**2 * 4);
  const red = new Uint8Array([64,0,0,255]);
  const green = new Uint8Array([0,255,0,255])
  assertEquals( p.slice(0,4), green);
  assertEquals( p.slice(12,16), red);
  assertEquals( p.slice(48,52), red);
  assertEquals( p.slice(60,64), green);

  await printImage({
    rawPixels: { width: size, height: size, data: p },
    width: 4,
  });
});
