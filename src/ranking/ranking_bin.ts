import { RepoDiskBackend } from "/repository/repo-disk.ts";
import { Community } from "/investor/mod.ts";
import { Ranking } from "./ranking.ts";
import { DataFrame } from "/utils/dataframe.ts";

import {   Cost,
  WASM,
  setupBackend,
  Sequential,
  DenseLayer,
  SigmoidLayer,
  BatchNorm1DLayer,
  ReluLayer,
  tensor1D,
  tensor2D,
 } from "netsaur";

const path: string = Deno.args[0];
const backend: RepoDiskBackend = new RepoDiskBackend(path);
export const community = new Community(backend);
const rank = new Ranking(community);
rank.days = 30;
const features: DataFrame = (await rank.data()).sort("SharpeRatio").reverse;
features.include([
  "PeakToValley",
  "RiskScore",
  "DailyDD",
  "LongPosPct",
  "ProfitableWeeksPct",
  "SharpeRatio",
]).digits(2).print("Significant Features");

// Write to to file
//Deno.writeTextFileSync("rank.json", JSON.stringify(features));
//Deno.exit(0);

// Relevant fields
// xs: MaxDailyRiskScore, DailyDD, WeeklyDD, MediumLeveragePct, PeakToValley, WeeksSinceRegistration
// YS: Profit, SharpeRatio
const xf = [
  "MaxDailyRiskScore",
  "DailyDD",
  "WeeklyDD",
  "MediumLeveragePct",
  "PeakToValley",
  "WeeksSinceRegistration",
];
const yf = ["Profit", "SharpeRatio"];
// Split xs and ys

//const input = features.map( record => Object.values(record).slice(0,-2) );
//const output = features.map( record => Object.values(record).slice(-2) );
const input: DataFrame = features.exclude([
  "VirtualCopiers",
  "Profit",
  "SharpeRatio",
]);
//console.log(input);

const output: DataFrame = features.include(["Profit", "SharpeRatio"]);

// Show a correlation matrix
const c = input.correlationMatrix(output);
c.amend(
  "Score",
  (r) => Math.abs(r.SharpeRatio as number) + Math.abs(r.Profit as number),
).sort("Score").reverse.digits(3).print("Correlation Matrix");

// Calculate total of coefficients
const sum: number = yf.map((col) => c.column(col).abs.sum).reduce((a, b) =>
  a + b
);
console.log("Total coefficients: ", sum);

//Deno.exit();

const samples = features.length;
//const input = features.map((record) => xf.map((f) => record[f])).slice(0, samples);
//const output = features.map((record) => yf.map((f) => record[f])).slice(0, samples);
const xw = input.names.length;
const yw = output.names.length;

/**
 * Creates a sequential neural network.
 */
await setupBackend(WASM);
const net = new Sequential({
  // The number of minibatches is set to 4 and the output size is set to 2.
  size: [128, xw],

  // The silent option is set to true, which means that the network will not output any logs during trainin
  silent: true,

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
    DenseLayer({ size: [yw] }),
    SigmoidLayer(),
    DenseLayer({ size: [yw] }),
  ],

  // The cost function used for training the network is the mean squared error (MSE).
  cost: Cost.MSE,
});


/**
 * Train the network on the given data.
 */
const time = performance.now();
net.train(
  [
    {
      inputs: tensor2D(input.grid),
      outputs: tensor2D(output.grid),
    },
  ],
  // The number of iterations is set to 10000.
  500,
);
console.log(`training time: ${performance.now() - time}ms`);


for ( let i=0; i<samples; i++ ) {
  const out1 = (await net.predict(tensor1D(input.grid[i]))).data;
   console.log(output.grid[i], out1);
}
