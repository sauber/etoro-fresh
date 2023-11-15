import { RepoDiskBackend } from "/repository/repo-disk.ts";
import { Community } from "/investor/mod.ts";
import { Ranking } from "./ranking.ts";
import { DataFrame } from "/utils/dataframe.ts";
import tf from "tensorflow";

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
//console.log({input, output});

//console.log(output);

// Create tensors
const xs = tf.tensor2d(input.grid);
//xs.print();
const ys = tf.tensor2d(output.grid);
ys.print();

const model = tf.sequential({
  layers: [
    //tf.layers.dense({inputShape: [27], units: 20}),
    tf.layers.batchNormalization({ inputShape: [xw] }),
    tf.layers.dense({ units: xw }),
    tf.layers.dropout(0.2),
    //tf.layers.dense({ units: xw*2 }),
    //tf.layers.dense({ units: 8 }),
    //tf.layers.dense({ units: 4 }),
    tf.layers.dense({ units: yw }),
  ],
});
model.compile({ optimizer: "adamax", loss: "meanSquaredError" });
model.summary();

const split = 0.2;
for (let i = 1; i <= 25; ++i) {
  const h = await model.fit(xs, ys, {
    epochs: 30,
    shuffle: true,
    //validationSplit: split,
  });
  console.log(
    "Loss after Epoch " + i + " : ",
    h.history.loss[0],
    //" : ",
    //h.history.val_loss[0],
  );
}

// Validation - last samples
//const xval = xs.slice([samples - 5]);
//const yval = ys.slice([samples - 5]);

// Validation - first samples
const xval = xs.slice([0], [5]);
const yval = ys.slice([0], [5]);

console.log("Validation input");
xval.print();

console.log("Validation output [profit, sharpe]");
yval.print();

console.log("Predicted output");
model.predict(xval).print();
console.log("numTensors : " + tf.memory().numTensors);
Deno.exit(0);
