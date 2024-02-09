import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { load } from "dotenv";
import { Community } from "/investor/mod.ts";
import { Ranking } from "/ranking/ranking.ts";
import { RepoDiskBackend } from "../../../../src/storage/mod.ts";

// Create Community object
const env = await load();
const path = env["DATAPATH"] as string; 
console.log('path: ', path);
const backend = new RepoDiskBackend(path);
const community = new Community(backend);
const ranking = new Ranking(backend);

// State must include community object
interface State {
  community: Community;
  rank: Ranking;
}

// Run before each request
export async function handler(
  _req: Request,
  ctx: MiddlewareHandlerContext<State>,
) {
  ctx.state.community = community;
  ctx.state.rank = ranking;
  const resp = await ctx.next();
  return resp;
}
