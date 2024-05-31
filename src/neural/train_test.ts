import { assertInstanceOf } from "$std/assert/assert_instance_of.ts";
import { Dense, LRelu, Network, Sigmoid } from "./network.ts";
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
    new Dense(2, 5),
    new LRelu(),
    new Dense(5, 5),
    new LRelu(),
    new Dense(5, 1),
    new Sigmoid(),
  ]);
  const train = new Train(network, xs, ys);
  train.epsilon = 0.01;
  train.run(200000, 0.9);

  // Validate
  xs.forEach((x) =>
    console.log(
      x,
      network.forward(x.map((v) => new Value(v))).map((v) => v.data),
    )
  );

  console.log('Loss Chart');
  console.log(train.loss_chart());
  console.log('Scatter Plot');
  await train.scatter_chart(10);
});
