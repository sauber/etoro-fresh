import { Handlers } from "$fresh/server.ts";
import { Community, Names } from "/investor/mod.ts";

export const handler: Handlers<null, { community: string[] }> = {
  GET(_req, ctx) {
    const community: string[] = ctx.state.community;
    const names: Names = community;
    return new Response(JSON.stringify(names), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
