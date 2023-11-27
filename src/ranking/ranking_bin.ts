import { RepoDiskBackend } from "/repository/repo-disk.ts";
import { Community } from "/investor/mod.ts";
import type { Names } from "/investor/mod.ts";
import { Ranking } from "./ranking.ts";
import { DataFrame } from "/utils/dataframe.ts";

const path: string = Deno.args[0];
const backend: RepoDiskBackend = new RepoDiskBackend(path);
const rank = new Ranking(backend);

await rank.train();
await rank.save();

// Validation
const community = new Community(backend);
const usernames: Names = await community.names();
const df = DataFrame.fromRecords(
  [...usernames].map((username) => {
    return { UserName: username };
  }),
);

const prediction = await rank.predict(df);
prediction.sort("SharpeRatio").reverse.print();
