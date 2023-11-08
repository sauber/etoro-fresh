import { RepoDiskBackend } from "/repository/repo-disk.ts";
import { Community } from "/investor/mod.ts";
import { Ranking } from "./ranking.ts";

const path: string = Deno.args[0];
const backend: RepoDiskBackend = new RepoDiskBackend(path);
export const community = new Community(backend);
const rank = new Ranking(community);

const features = await rank.data();
console.log(features);