import { Handlers } from "$fresh/server.ts";
import { Community, Names } from "/investor/mod.ts";

export const handler: Handlers<null, { community: Community }> = {
  async GET(_req, ctx) {
    const community: Community = ctx.state.community;
    // TODO, only return names from last dir
    const names: Names = await community.names();
    return new Response(JSON.stringify(names.values), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
