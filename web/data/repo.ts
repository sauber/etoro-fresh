/**
 * Interface to access underlying data modules
 */

import { CachingBackend, DiskBackend } from "📚/storage/mod.ts";
import { Community } from "📚/repository/mod.ts";
import type { Investors } from "📚/repository/mod.ts";

const data_path = Deno.env.get("DATAPATH");
if (!data_path) throw new Error("DATAPATH environment variable not defined");
const disk_repo = new DiskBackend(data_path);
const cache_repo = new CachingBackend(disk_repo);
const community = new Community(cache_repo);

/** List of investors at most recent date */
export function community_latest(): Promise<Investors> {
  return community.latest();
}
