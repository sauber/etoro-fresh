import { Handlers } from "$fresh/server.ts";
import { Community, Names } from "/investor/mod.ts";

export const handler: Handlers<null, { community: Community }> = {
  async GET(_req, ctx) {
    const community: Community = ctx.state.community;
    const names: Names = await community.names();
    //console.log('names/last handler: ', names);
    return new Response(JSON.stringify([...names]), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
