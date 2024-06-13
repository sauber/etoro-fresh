import { assertInstanceOf } from "$std/assert/assert_instance_of.ts";
import { assertAlmostEquals } from "$std/assert/mod.ts";
import { Network } from "./network.ts";
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
  const network = new Network(0);
  const train = new Train(network, [], []);
  assertInstanceOf(train, Train);
});

// Dense(2), Sigmoid, Dense(1), Sigmoid is theoritically enough
// but takes a long time to train, and often doesn't find the solution.
// A much larger network using relu is faster and higher chance of success.
Deno.test("XOR training", async () => {
  const network: Network = new Network(2)
    .dense(5)
    .lrelu
    .dense(2)
    .lrelu
    .dense(1)
    .sigmoid;

  const train = new Train(network, xs, ys);
  train.epsilon = 0.01;
  train.run(200000, 0.9);
  // network.print();

  console.log("Loss Chart");
  console.log(train.loss_chart());
  console.log("Scatter Plot");
  await train.scatter_chart([0, 1], [0, 1], [], 10);

  // Validate
  xs.forEach((x, i) => {
    const p = network.forward(x.map((v) => new Value(v))).map((v) => v.data);
    console.log(x, p);
    assertAlmostEquals(p[0], ys[i][0], 0.2);
  });

});
