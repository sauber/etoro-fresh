import { Backend } from "📚/backend/mod.ts";
import { Community, Investors } from "📚/repository/mod.ts";
import { Investor } from "📚/investor/mod.ts";
import { diffDate } from "📚/time/mod.ts";
import { Features } from "📚/ranking/mod.ts";
import { DataFrame } from "@dataframe";
import { avg } from "📚/math/statistics.ts";
// import { Dense, LRelu, Network, Normalization, Relu } from "./micrograd.ts";
import { Network, Train } from "jsr:@sauber/neurons@1.0.7";
import { Dashboard } from "jsr:@sauber/ml-cli-dashboard";
// import { Train } from "./train.ts";

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

// Use Correlation matrix to extract only the top 5 inputs most correlated to output
const input = DataFrame.fromRecords(features.map((f) => f.input));
const output = DataFrame.fromRecords(features.map((f) => f.output)).include([
  "SharpeRatio",
]);
const corr = input.correlationMatrix(output);
const columns = 8;
const weights = corr
  .amend("Abs", (r) => Math.abs(r.SharpeRatio as number))
  .sort("Abs")
  .reverse
  .slice(0, columns)
  .include(["Keys", "SharpeRatio"])
  .rename({ Keys: "Key", SharpeRatio: "Weight" });
const w: Record<string, number> = Object.assign(
  {},
  ...weights.records.map((r) => ({ [r.Key as string]: r.Weight })),
);
// console.log({weights}, weights.records);;
// console.log("Correlations:", w);
const keys = weights.values("Key") as string[];
// console.log({keys});
const inputs = input.include(keys);

// Transform to training data
const xs: number[][] = inputs.records.map((r) => Object.values(r) as number[]);
const ys: number[][] = output.records.map((r) => [r.SharpeRatio as number]);

// const network = new Network([
//   new Normalization(5),
//   new Dense(5, 11),
//   new LRelu(),
//   new Dense(11, 5),
//   new LRelu(),
//   new Dense(5, 1),
// ]);

const network = new Network(columns).tanh.dense(11).lrelu.dense(5).lrelu.dense(1);

// Mean number in list
function mean(l: number[]): number {
  return l.slice().sort()[Math.round(l.length/2)];
}

// Column from grid
function col(g: number[][], index: number): number[] {
  return g.map(row=>row[index]);
}

const means: number[] = xs[0].map((_,index) => mean(col(xs, index)));
// console.log({means});

function predict(a, b): number {
  const input = means.slice();
  input[0] = a;
  input[1] = b;
  const output = network.predict(input);
  return output[0];
}

const scatter: Array<[number, number]> = xs.map(row=>[row[0], row[1]]);
const values: Array<number> = ys.map(row=>row[0]);
const dashboard = new Dashboard(78, 16, scatter, values, predict, 20000);

function status (iterations: number, lossHistory: number[]): void {
  const loss = lossHistory[lossHistory.length-1];
  console.log(dashboard.render(iterations, loss));
}

const train = new Train(network, xs, ys);
train.epsilon = 0.0001;
train.callback = status;
train.callbackFrequency = 100;
train.epsilon = 0.001;
const iterations = train.run(20000, 0.1);
// console.log(iterations);
// network.print();
console.log(network.export);

// Validation
// xs.forEach((input, index) => console.log(input, ys[index], network.predict(input)));
// const ypred = xs.map((x) => network.predict(x)); // run the model on each input and get an array of predictions
// console.log('ys [actual, prediction]:', ypred.map((y, index) => [ys[index].data, y.data as Value]));
// console.log(ys.map((y) => y.data));

// Display predictions for 5 random samples
console.log("Validation");
for (let i = 0; i < 5; i++) { // train the model for 200 iterations
  const sample = Math.floor(Math.random() * xs.length);
  console.log("sample n:", sample);
  console.log("  xs:", xs[sample]);
  console.log("  ys:", ys[sample]);
  console.log("  yp:", network.predict(xs[sample]));
}
