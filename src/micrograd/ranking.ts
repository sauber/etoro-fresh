import { Backend } from "📚/backend/mod.ts";
import { Community, Investors } from "📚/repository/mod.ts";
import { Investor } from "📚/investor/mod.ts";
import { diffDate } from "📚/time/mod.ts";
import { Features } from "📚/ranking/mod.ts";
import { getLoss, MLP, toValues, Value } from "./mod.ts";
import { DataFrame } from "📚/dataframe/mod.ts";
import { avg, sum } from "📚/math/statistics.ts";
import { assertThrows } from "$std/assert/assert_throws.ts";

// Load investor data
const backend = new Backend(Deno.args[0]);
const community: Community = backend.community;
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
const features: Training = investors.map((investor: Investor) => {
  const f = new Features(investor);
  return { input: f.input(), output: f.output() };
});

const input = DataFrame.fromRecords(features.map((f) => f.input));
const output = DataFrame.fromRecords(features.map((f) => f.output)).include([
  "SharpeRatio",
]);
const corr = input.correlationMatrix(output);
// corr.print("Correlation Matrix");

const columns = 5;
const weights = corr
  .amend("Abs", (r) => Math.abs(r.SharpeRatio as number))
  .sort("Abs")
  .reverse
  .slice(0, columns)
  .include(["Keys", "SharpeRatio"])
  .rename({ Keys: "Key", SharpeRatio: "Weight" })
  .bake;
// weights.print("Weights");
const w: Record<string, number> = Object.assign(
  {},
  ...weights.records.map((r) => ({ [r.Key as string]: r.Weight })),
);
const mid = sum(Object.values(w));
console.log(w, mid);

const keys = weights.column("Key").values as string[];
// console.log(keys);
const inputs = input.include(keys);
// const significant = inputs
//   .join(output)
//   .sort("SharpeRatio")
//   .reverse
//   .amend("Predict", (r) => -mid + sum(Object.keys(w).map((k) => Math.tanh(r[k] as number) * w[k])));
// console.log(significant);
// significant.print("Significant");
// Deno.exit(143);

// Transform to training data
const xs: Value[][] = inputs.records.map(r=>toValues(Object.values(r).map(v=>Math.tanh(v as number))));
const ys: Value[] = toValues(output.records.map(r=>r.SharpeRatio as number));
// console.log({xs, ys});
// Deno.exit(143);

const n = new MLP(columns, [10, 10, 1]); // create a multilayer perceptron model with 3 input units, 2 hidden layers with 4 units each, and 1 output unit
const parameters = n.parameters();
// console.log(parameters);

// Training
for (let i = 0; i < 200; i++) { // train the model for 200 iterations
  const ypred = xs.map((x) => n.run(x)); // run the model on each input and get an array of predictions
  const loss = getLoss(ys, ypred as Value[]); // compute the mean squared error loss between the predictions and the outputs
  // console.log({ ys: ys.map((y) => y.data), ypred: ypred.map((y) => y.data) });

  for (const p of parameters) { // loop over all the parameters of the model
    p.grad = 0; // reset their gradients to zero
  }
  loss.backward(); // compute the gradient of the loss with respect to all the parameters

  for (const p of parameters) { // loop over all the parameters of the model
    p.data -= 0.02 * p.grad; // update their data by subtracting a small fraction of their gradients
  }

  console.log(i, ": loss:", loss.data); // print the iteration number and the loss value
}

// Validation
const ypred = xs.map((x) => n.run(x)); // run the model on each input and get an array of predictions
console.log(ypred.map(y=>y.data));
console.log(ys.map(y=>y.data));

