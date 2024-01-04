import { RepoDiskBackend } from "/repository/repo-disk.ts";
import { Community } from "/investor/mod.ts";
import type { Names } from "/investor/mod.ts";
import { Ranking } from "./ranking.ts";

const path: string = Deno.args[0];
const backend: RepoDiskBackend = new RepoDiskBackend(path);
const rank = new Ranking(backend);

await rank.train();
await rank.save();

// Validation
const community = new Community(backend);
const usernames: Names = await community.valid();
const prediction = await rank.predict(usernames);
prediction.sort("SharpeRatio").reverse.slice(0, 5).print();
