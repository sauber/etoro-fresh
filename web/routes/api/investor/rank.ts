import { Handlers } from "$fresh/server.ts";
import { Community, Names } from "/investor/mod.ts";
import { DataFrame } from "/utils/dataframe.ts";
import { Ranking } from "/ranking/ranking.ts";

export const handler: Handlers<null, { community: Community; rank: Ranking }> =
  {
    async GET(_req, ctx) {
      const community: Community = ctx.state.community;
      const rank: Ranking = ctx.state.rank;
      // TODO, only return names from last dir
      const names: Names = await community.names();
      const prediction: DataFrame = await rank.predict(names);
      return new Response(JSON.stringify(prediction.records), {
        headers: { "Content-Type": "application/json" },
      });
    },
  };
