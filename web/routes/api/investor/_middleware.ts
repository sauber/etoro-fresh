import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { load } from "dotenv";
import { Community, CommunityFileRepo } from "/investor/mod.ts";
//import { Files } from "/infrastructure/repo/files.ts";
import { RepoDiskBackend } from "/repository/repo-disk.ts";
import { Repo } from "/repository/repo.ts";

// Create Community object
const env = await load();
const path = env["DATAPATH"] as string; 
console.log('path: ', path);
const backend = new RepoDiskBackend(path);
const repo = new Repo(backend);
const comm = repo.community;

// State must include community object
interface State {
  community: string[];
}

// Run before each request
export async function handler(
  _req: Request,
  ctx: MiddlewareHandlerContext<State>,
) {
  ctx.state.community = comm;
  const resp = await ctx.next();
  return resp;
}
