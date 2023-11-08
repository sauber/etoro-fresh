import { RepoDiskBackend } from "/repository/repo-disk.ts";
import { Community } from "/investor/mod.ts";
import { Ranking } from "./ranking.ts";
import tf from "tensorflow";

const path: string = Deno.args[0];
const backend: RepoDiskBackend = new RepoDiskBackend(path);
export const community = new Community(backend);
const rank = new Ranking(community);
const features = await rank.data();

// Split xs and ys
const input = features.map( record => Object.values(record).slice(0,-2) );
const output = features.map( record => Object.values(record).slice(-2) );
//console.log(output);

// Create tensors
const xs = tf.tensor2d(input);
//xs.print();
const ys = tf.tensor2d(output);
//ys.print();

const model = tf.sequential({
  layers: [
      //tf.layers.dense({inputShape: [27], units: 20}),
      tf.layers.batchNormalization({inputShape: [27]}),
      tf.layers.dense({units: 27}),
      tf.layers.dropout(0.2),
      //tf.layers.dense({units: 12}),
      //tf.layers.dense({units: 4}),
      tf.layers.dense({units: 2}),
  ]
});
model.compile({optimizer: 'adam', loss: 'meanSquaredError'});
model.summary();

const split = 0.3;
for (let i = 1; i <= 100 ; ++i) {
const h = await model.fit(xs, ys, {
    epochs: 3,
    shuffle: true,
    validationSplit: split,
});
console.log("Loss after Epoch " + i + " : ",  h.history.loss[0], " : ", h.history.val_loss[0]);
}

// Validation
const xval = xs.slice([features.length-2]);
const yval = ys.slice([features.length-2]);
//const xval = xs.slice([0, 0], [2, 27]);
//const yval = ys.slice([0, 0], [ 2, 2]);

console.log('Validation input');
xval.print();

console.log('Validation output [profit, sharpe]');
yval.print();

console.log('Predicted output');
model.predict(xval).print();
console.log('numTensors : ' + tf.memory().numTensors);
Deno.exit(0);