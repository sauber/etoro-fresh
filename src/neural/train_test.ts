import { assertInstanceOf } from "$std/assert/assert_instance_of.ts";
import { Dense, Network, Relu, Sigmoid, Tanh, Binary } from "./network.ts";
import { Inputs, Outputs, Train } from "./train.ts";
import { Value } from "./value.ts";

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

Deno.test("Step", () => {
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
  train.run(2000, 0.5);
  // console.log(train);

  // Validate
  xs.forEach((x) =>
    console.log(
      x,
      network.forward(x.map((v) => new Value(v))).map((v) => v.data),
    )
  );

  network.print();
});
