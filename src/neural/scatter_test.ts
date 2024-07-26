import { assertEquals, assertInstanceOf } from "$std/assert/mod.ts";
// import { Dense, LRelu, Network, Sigmoid } from "./micrograd.ts";
import { Network } from "./network.ts";
import { ScatterPlot } from "./scatter.ts";
import { Inputs, Outputs, Train } from "./train.ts";
import { printImage } from "terminal_images";

// const network = new Network([
//   new Dense(2, 3),
//   new LRelu(),
//   new Dense(3, 1),
//   new Sigmoid(),
// ]);


const network = new Network(2).dense(3).lrelu.dense(1).sigmoid;

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
  const p: Uint8Array = s.pixels(size*2, size*2);

  await printImage({
    rawPixels: { width: size*2, height: size*2, data: p },
    width: size,
  });

  assertInstanceOf(p, Uint8Array);
  assertEquals(p.length, size**2 * 4 * 4);
  const red = new Uint8Array([64,0,0,255]);
  const green = new Uint8Array([0,255,0,255])
  // const topLeftIndex = 0;
  const line = size * 2 * 4;
  const topLeftIndex = line;
  const topRightIndex = line + line - 4;
  const bottomLeftIndex = size * 2 * line - line;
  const bottomRightIndex = size * 2 * line - 4;

  assertEquals( p.slice(topLeftIndex,topLeftIndex + 4), green);
  assertEquals( p.slice(topRightIndex,topRightIndex + 4), red);
  assertEquals( p.slice(bottomLeftIndex,bottomLeftIndex + 4), red);
  assertEquals( p.slice(bottomRightIndex,bottomRightIndex + 4), green);
});
