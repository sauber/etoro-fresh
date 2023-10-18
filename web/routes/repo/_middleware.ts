import { MiddlewareHandlerContext } from "$fresh/server.ts";
//import { Repo } from "/repository/repo.ts";

interface State {
//  repo: Repo;
}

export async function handler(
  _req: Request,
  ctx: MiddlewareHandlerContext<State>,
) {
  //ctx.state.repo = new Repo("/tmp/data");
  const resp = await ctx.next();
  resp.headers.set("server", "fresh server");
  return resp;
}
