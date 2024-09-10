/**
 * Interface to access underlying data modules
 */

import { load } from "$std/dotenv/mod.ts";
import { CachingBackend, DiskBackend } from "📚/storage/mod.ts";
import { Community } from "📚/repository/mod.ts";
import { Investor } from "📚/investor/mod.ts";
import type { Investors } from "📚/repository/mod.ts";
import { DataFrame } from "dataframe";
import { Ranking } from "📚/ranking/mod.ts";

let data_path = Deno.env.get("DATAPATH");

// Try to load from .env file
if (!data_path) {
  const env = await load();
  data_path = env["DATAPATH"];
}

if (!data_path) throw new Error("DATAPATH environment variable not defined");
const disk_repo = new DiskBackend(data_path);
const cache_repo = new CachingBackend(disk_repo);
const community = new Community(cache_repo);

/** List of investors at most recent date */
export function community_all(): Promise<Investors> {
  return community.all();
}

/** List of investors at most recent date */
export function community_latest(): Promise<Investors> {
  return community.latest();
}

/** List of investors at most recent date */
export function investor(UserName: string): Promise<Investor> {
  return community.investor(UserName);
}

/** Ranking of investors */
export async function ranking(): Promise<DataFrame> {
  const investors: Investors = await community.latest();
  const model = new Ranking(cache_repo);
  const ranks: DataFrame = await model.predict(investors);
  return ranks;
}
