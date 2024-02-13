import { DiskBackend } from "/storage/mod.ts";
import { Community } from "/repository/mod.ts";
import { Ranking } from "./ranking.ts";
import { Investor } from "📚/investor/mod.ts";
import { diffDate } from "📚/utils/time/mod.ts";

// Repo
const path: string = Deno.args[0];
const backend = new DiskBackend(path);
const rank = new Ranking(backend);

// Load data
type Investors = Array<Investor>;
const community = new Community(backend);
const all: Investors = await community.all();
const train: Investors = all.filter(
  (investor: Investor) =>
    diffDate(investor.stats.start, investor.chart.end) >= 30
);

// Training
await rank.train(train);
await rank.save();

// Validation
const prediction = await rank.predict(train);
prediction.sort("SharpeRatio").reverse.slice(0, 5).print("Top 5 SharpeRatio");
