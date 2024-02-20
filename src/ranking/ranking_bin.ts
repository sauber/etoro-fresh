import { DiskBackend, CachingBackend } from "/storage/mod.ts";
import { Community } from "/repository/mod.ts";
import { Ranking } from "./ranking.ts";
import { Investor } from "📚/investor/mod.ts";
import { diffDate } from "📚/utils/time/mod.ts";

// Repo
const path: string = Deno.args[0];
const disk = new DiskBackend(path);
const backend = new CachingBackend(disk);
const rank = new Ranking(backend);

// Load data
console.log("Loading...");
type Investors = Array<Investor>;
const community = new Community(backend);
const all: Investors = await community.all();
console.log(all.length);
const train: Investors = all.filter(
  (investor: Investor) =>
    diffDate(investor.stats.start, investor.chart.end) >= 30 &&
    investor.chart.last != 6000
);
console.log("Total loaded: ", all.length, "Trainable: ", train.length);

// Training
console.log("Training...");
await rank.train(train);
await rank.save();

// Validation
const latest = await community.latest();
console.log('latest count', latest.length);
const prediction = await rank.predict(latest);
//prediction.print("Predictions");
prediction.sort("SharpeRatio").reverse.slice(0, 5).print("Top 5 SharpeRatio");
