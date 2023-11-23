import { RepoDiskBackend } from "/repository/repo-disk.ts";
import { Community } from "/investor/mod.ts";
import { Ranking } from "./ranking.ts";
import { DataFrame } from "/utils/dataframe.ts";

import {
  Cost,
  WASM,
  setupBackend,
  Sequential,
  DenseLayer,
  SigmoidLayer,
  BatchNorm1DLayer,
  ReluLayer,
  tensor1D,
  tensor2D,
  Array1D,
  Array2D,
  AdamOptimizer,
  Dropout1DLayer,
} from "netsaur";

// Load investor stats data
const path: string = Deno.args[0];
const backend: RepoDiskBackend = new RepoDiskBackend(path);
export const community = new Community(backend);
const rank = new Ranking(community);
rank.days = 30;
const features: DataFrame = await rank.data();

// Split into training and validation set
const validation_ratio = 0.1;
const validation_length = Math.round(features.length * validation_ratio);
const training = features.slice(0, features.length - validation_length);
const validation = features.slice(
  features.length - validation_length,
  features.length
);
//console.log({training: training.length, validation: validation.length});

// Split input and output
const xf = ["Profit", "SharpeRatio"];
//const train_x = training.exclude([...xf, "VirtualCopiers"]);
//const train_y = training.include(xf);
const valid_x = validation.exclude([...xf, "VirtualCopiers"]);
const valid_y = validation.include(xf);

// Count of fields in input and output
const xw = valid_x.names.length;
const yw = valid_y.names.length;

/**
 * Creates a sequential neural network.
 */
await setupBackend(WASM);
const net = new Sequential({
  // The number of minibatches is set to 4 and the output size is set to 2.
  size: [128, xw],

  // The silent option is set to true, which means that the network will not output any logs during trainin
  silent: false,

  /**
   * Defines the layers of a neural network in the XOR function example.
   * The neural network has two input neurons and one output neuron.
   * The layers are defined as follows:
   * - A dense layer with 3 neurons.
   * - sigmoid activation layer.
   * - A dense layer with 1 neuron.
   * -A sigmoid activation layer.
   */
  layers: [
    BatchNorm1DLayer({ momentum: 0.9 }),
    ReluLayer(),
    DenseLayer({ size: [Math.round(xw / 2)] }),
    SigmoidLayer(),
    DenseLayer({ size: [yw] }),
  ],

  // The cost function used for training the network is the mean squared error (MSE).
  cost: Cost.MSE,

  // Use Adam optimizer
  optimizer: AdamOptimizer(),
});

/** Calculate Mean Squared Error betwen two datasets of same size */
function MSE(expected: Array2D, actual: Array2D): number {
  let sum = 0;
  let count = 1;
  for (let y = 0; y < expected.length; y++) {
    for (let x = 0; x < expected[0].length; x++) {
      const diff = expected[y][x] - actual[y][x];
      const squared = diff * diff;
      sum += squared;
      ++count;
    }
  }
  const avg = sum / count;
  return avg;
}

async function predictOne(values: Array1D, results: Array2D): Promise<void> {
  const out1 = (await net.predict(tensor1D(values))).data;
  results.push([out1[0], out1[1]]);
}

async function predict(rows: Array2D): Promise<Array2D> {
  const results: Array2D = [];
  await Promise.all(rows.map((r) => predictOne(r, results)));
  return results;
}

/**
 * Train the network on the given data.
 */
const time = performance.now();
for (let i = 0; i < 50; i++) {
  const shuffled = training.shuffle;
  const train_x = shuffled.exclude([...xf, "VirtualCopiers"]);
  const train_y = shuffled.include(xf);
  const inputs = tensor2D(train_x.grid as Array2D);
  const outputs = tensor2D(train_y.grid as Array2D);
  net.train(
    [{ inputs, outputs }],
    // The number of iterations is set to 10000.
    100,
    // Batches
    50,
    // Learning Rate
    0.01
  );

  // Calculate Training loss
  const train_p = await predict(train_x.grid as Array2D);
  const train_loss = MSE(train_y.grid as Array2D, train_p);

  // Calculate Validation Loss
  const valid_p = await predict(valid_x.grid as Array2D);
  const valid_loss = MSE(valid_y.grid as Array2D, valid_p);

  console.log({ train_loss, valid_loss });

  //const i = 0;
  //const out1 = (await net.predict(tensor1D(input.grid[i] as Array1D))).data;
  //console.log(output.grid[i], out1);
}
console.log(`training time: ${performance.now() - time}ms`);

/*
for (let i = 0; i < 5; i++) {
  const out1 = (await net.predict(tensor1D(input.grid[i] as Array1D))).data;
  console.log(output.grid[i], out1);
}
console.log("...");
for (let e = 5; e > 0; e--) {
  const i = input.length - e;
  const out1 = (await net.predict(tensor1D(input.grid[i] as Array1D))).data;
  console.log(output.grid[i], out1);
}
*/

// Test results
const test_x = valid_x.slice(0, 5).grid as Array2D;
const test_y = valid_y.slice(0, 5).grid as Array2D;
//const test_x = training.exclude([...xf, "VirtualCopiers"]).slice(0,5).grid as Array2D;
//const test_y = training.include(xf).slice(0,5).grid as Array2D;
const test_p = await predict(test_x);
const test_loss = MSE(test_y, test_p);
for (let i = 0; i < test_x.length; i++) {
  console.log({ expected: test_y[i], predicted: test_p[i] });
}
console.log({ test_loss });
