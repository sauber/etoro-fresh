import { Handlers } from "$fresh/server.ts";
import { Community } from "/investor/mod.ts";
//import { today } from "/utils/time/calendar.ts";

export const handler: Handlers<null, { community: Community }> = {
  async GET(_req, ctx) {
    const community: Community = ctx.state.community;
    //const names: Names = await community.names();
    const date = await community.end();
    //const date = today();
    return new Response(JSON.stringify(date), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
