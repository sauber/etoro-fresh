import brain from "npm:brain.js@1.6.0";
import { Backend } from "📚/backend/mod.ts";
import { Investors } from "📚/repository/community.ts";
import { Investor } from "📚/investor/mod.ts";
import { diffDate } from "📚/time/mod.ts";
import { Features } from "📚/ranking/mod.ts";
import { DataFrame } from "@dataframe";
import  { Dashboard } from "jsr:@sauber/ml-cli-dashboard";

// Confirm arguments
if ( ! Deno.args[0] )
  throw new Error("Error: Data directory must be specified");

// Load an pick investors with sufficient amount of data
const path: string = Deno.args[0];
const backend = new Backend(path);
const community = backend.community;
const all: Investors = await community.all();
const investors: Investors = all.filter(
  (investor: Investor) =>
    diffDate(investor.stats.start, investor.chart.end) >= 30 &&
    investor.chart.last != 6000,
);
console.log("Total loaded: ", all.length, "Trainable: ", investors.length);

// Identify input and output features
type Sample = {
  input: Record<string, number>;
  output: Record<string, number>;
};
type Training = Array<Sample>;
const training: Training = investors.map((investor: Investor) => {
  const f = new Features(investor);
  return { input: f.input(), output: f.output() };
});
// console.log(training);

/** training has this format
 * [
 *   {
 *     input: {
 *       PopularInvestor: 0,
 *       Gain: 53.98,
 *       RiskScore: 4,
 *       MaxDailyRiskScore: 5,
 *       ...
 *     },
 *     output: {
 *       Profit: 0.050105912540352834,
 *       SharpeRatio: 0.00008704844668448779
 *     }
 *   },
 *   ...
 * ]
 * 
 */

// Convert training into grid of input values and output values
const xs: number[][] = training.map(r => Object.values(r.input));
const ys: number[][] = training.map(r => Object.values(r.output));
// console.log(inputs, outputs);

// Identify most significant parameters




// provide optional config object (or undefined). Defaults shown.
const config = {
  binaryThresh: 0.5,
  hiddenLayers: [8, 4], // array of ints for the sizes of the hidden layers in the network
  activation: "tanh", // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
  leakyReluAlpha: 0.01, // supported for activation type 'leaky-relu'
  iterations: 10000,
  learningRate: 0.1,
  log: true,
  logPeriod: 10,
  callbackPeriod: 20,
  callback: (state) => console.log(state),
};

// create a simple feed forward neural network with backpropagation
const net = new brain.NeuralNetwork(config);

// Training data
// const training = [
//   { input: [0, 0], output: [0] },
//   { input: [0, 1], output: [1] },
//   { input: [1, 0], output: [1] },
//   { input: [1, 1], output: [0] },
// ];

// Array.from(Array(5).keys()).forEach(i => {
//   console.log(i);
//   const status = net.train(training);
//   console.log({status});
// });
Deno.exit(143);


// Export
// const data = net.toJSON();
// console.log(data);
console.log(net.trainOpts);

// Import
// const trained = new brain.NeuralNetwork().fromJSON(data);

// Train some more
// trained.train(training);

// Predict
// console.log(trained.run([0, 0])); // [0.987]
// console.log(trained.run([0, 1])); // [0.987]
// console.log(trained.run([1, 0])); // [0.987]
// console.log(trained.run([1, 1])); // [0.987]

const width = 78;
const height = 16;
const dashboard = new Dashboard(width, height, training);


// Validate
const records = investors.map( (i: Investor, n: number) => {
  const name = i.UserName;
  const o = training[n].output;
  const p = net.run(training[n].input);
  // console.log({o, p});
  return { name, Profit: o.Profit, SharpeRatio: o.SharpeRatio, PredictP: p.Profit, PredictS: p.SharpeRatio }
});
// console.log(records);

const table = DataFrame.fromRecords(records).digits(4).sort('SharpeRatio').reverse;
table.print('Predictions');