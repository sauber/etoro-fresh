import { Head } from "$fresh/runtime.ts";
import { defineRoute, RouteContext } from "$fresh/server.ts";
import Rankgrid from "📦/community/RankGrid.tsx";
import Feature from "📦/ux/Feature.tsx";
import { community_all, ranking } from "../data/repo.ts";
import type { Investors } from "📚/repository/mod.ts";
import { DataFrame } from "📚/utils/dataframe.ts";

export default defineRoute(async (req: Request, ctx: RouteContext) => {
  const investors: Investors = await community_all();
  const prediction: DataFrame = await ranking();

  return (
    <>
      <Head>
        <title>Investor Ranking</title>
      </Head>
      <Feature>
        <Rankgrid investors={investors} rank={prediction} />
      </Feature>
    </>
  );
});
