/** Display sorted ranking of most recent investors */
import type { NetworkData } from "@sauber/neurons";
import { DataFrame } from "@sauber/dataframe";
import { Model } from "📚/ranking/model.ts";
import { CachingBackend, DiskBackend } from "📚/storage/mod.ts";
import { Community } from "📚/repository/mod.ts";
import { DateFormat } from "📚/time/mod.ts";
import { Input } from "📚/ranking/mod.ts";
import { Features } from "📚/ranking/features.ts";
import { Investor } from "📚/investor/mod.ts";

// Repo
if (!Deno.args[0]) throw new Error("Path missing");
const path: string = Deno.args[0];
const disk = new DiskBackend(path);
const backend = new CachingBackend(disk);

const assetname = "ranking.network";
if (!await backend.has(assetname)) {
  throw new Error("No ranking model exists. Perform training first.");
}

console.log("Loading existing model...");
const rankingparams = await backend.retrieve(assetname) as NetworkData;
const model = Model.import(rankingparams);

// Load list of investors
console.log("Loading...");
const community = new Community(backend);
const latest = await community.latest();
const end: DateFormat = await community.end();
console.log(`${end} investor count:`, latest.length);

// Predict SharpeRatio for each Investor
const sr: number[] = latest.map((investor: Investor) =>
  model.predict(new Features(investor).input(end) as Input)[0]
);

const df = DataFrame.fromRecords(
  latest.map((investor: Investor, index: number) => ({
    Investor: investor.UserName,
    SharpeRatio: sr[index],
  })),
).sort("SharpeRatio");

df.reverse.slice(0,5).print("Desired Investor Ranking");
df.slice(0,5).print("Undesired Investor Ranking");

