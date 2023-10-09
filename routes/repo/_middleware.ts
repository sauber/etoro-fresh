import { MiddlewareHandlerContext } from "$fresh/server.ts";
import Files from "files";

interface State {
  data: Files;
}

export async function handler(
  _req: Request,
  ctx: MiddlewareHandlerContext<State>,
) {
  ctx.state.data = new Files("/tmp/data");
  const resp = await ctx.next();
  resp.headers.set("server", "fresh server");
  return resp;
}
