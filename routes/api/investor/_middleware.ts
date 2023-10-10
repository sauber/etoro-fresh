import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { load } from "dotenv";
import { Community, CommunityFileRepo } from "/investor/mod.ts";
import { Files } from "/utils/repo/files.ts";

// Create Community object
await load({export: true});
const path = Deno.env.get("DATAPATH") as string; 
console.log('path: ', path);
const files = new Files(path);
const repo = new CommunityFileRepo(files);
const comm = new Community(repo);

// State must include community object
interface State {
  community: Community;
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
