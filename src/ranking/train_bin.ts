import type { NetworkData } from "@sauber/neurons";
import { shuffleArray } from "@hugoalh/shuffle-array";
import { CachingBackend, DiskBackend } from "📚/storage/mod.ts";
import { Model } from "📚/ranking/model.ts";
import type { Inputs, Outputs } from "📚/ranking/mod.ts";
import { TrainingData } from "📚/ranking/trainingdata.ts";
import { Community } from "📚/repository/community.ts";

// Repo
if (!Deno.args[0]) throw new Error("Path missing");
const path: string = Deno.args[0];
const disk = new DiskBackend(path);
const backend = new CachingBackend(disk);

// Training data
console.log("Loading...");
const community = new Community(backend);
const data = new TrainingData(community, 30);
await data.load();
const xs: Inputs = data.inputs;
const ys: Outputs = data.outputs;

// Model
const assetname = "ranking.network";
let model: Model;
if (await backend.has(assetname)) {
  const rankingparams = await backend.retrieve(assetname) as NetworkData;
  model = Model.import(rankingparams);
} else {
  model = Model.generate(xs[0].length);
}

// Training
console.log("Training...");
const iterations = 2000;
const learning_rate = 0.001;
model.train(xs, ys, iterations, learning_rate);

// Validation
console.log("Validation");
// Pick 5 random inputs
const samples = shuffleArray(Array.from(Array(xs.length).keys()))
  .slice(0, 5)
  .sort((a, b) => a - b);
// Compare training output with predicted output
samples.forEach((sample) => {
  console.log("sample n:", sample);
  console.log("  xs:", xs[sample]);
  console.log("  ys:", ys[sample]);
  console.log("  yp:", model.predict(xs[sample]));
});

// Store Model
console.log("Saving...");
await backend.store(assetname, model.export());
