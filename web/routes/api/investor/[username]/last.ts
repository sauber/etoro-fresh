import { Handlers } from "$fresh/server.ts";
import { Community, Investor } from "/investor/mod.ts";
import type { InvestorExport } from "/investor/mod.ts";

export const handler: Handlers<null, { community: Community }> = {
  async GET(_req, ctx) {
    const community: Community = ctx.state.community;
    const username = ctx.params.username;
    //const names: Names = await community.names();
    const investor: Investor = community.investor(username);
    const data: InvestorExport = await investor.export();
    //console.log('names/last handler: ', names);
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
