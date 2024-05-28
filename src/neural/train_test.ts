import { assertInstanceOf } from "$std/assert/assert_instance_of.ts";
import { Dense, Network, Sigmoid, Relu } from "./network.ts";
import { Inputs, Outputs, Train } from "./train.ts";
import { Value } from "./value.ts";
import { printImage } from "https://deno.land/x/terminal_images@3.1.0/mod.ts";

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

Deno.test("Initialize", () => {
  const network = new Network([]);
  const train = new Train(network, [], []);
  assertInstanceOf(train, Train);
});

// Dense(2), Sigmoid, Dense(1), Sigmoid is theoritically enough
// but takes a long time to train, and often doesn't find the solution.
// A much larger network using relu is faster and higher chance of success.
Deno.test("XOR training", async () => {
  const network = new Network([
    new Dense(2, 9),
    new Relu(),
    new Dense(9, 5),
    new Relu(),
    new Dense(5, 1),
    new Sigmoid(),
  ]);
  const train = new Train(network, xs, ys);
  // console.log(train);
  train.run(200000, 0.9);
  // console.log(train);

  // Validate
  xs.forEach((x) =>
    console.log(
      x,
      network.forward(x.map((v) => new Value(v))).map((v) => v.data),
    )
  );

  // network.print();
  train.print_loss();
  // train.print_velocity();

  // Generate scatter data
  const size = 56;
  const buffer: Array<number> = [];
  for (let x = 0; x < size; ++x) {
    for (let y = 0; y < size; ++y) {
      const p = network.forward([new Value(x / (size-1)), new Value(y / (size-1))]);
      const c = Math.floor(p[0].data * 256);
      buffer.push(c, c, c, 255);
    }
  }
  const imageBuffer: Uint8Array = new Uint8Array(buffer);

  await printImage({
    rawPixels: { width: size, height: size, data: imageBuffer },
    width: 25,
  });
});
