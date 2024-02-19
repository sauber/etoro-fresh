import { Head } from "$fresh/runtime.ts";
//import { load } from "dotenv";
import { defineRoute, RouteContext } from "$fresh/server.ts";

import Rankgrid from "📦/community/RankGrid.tsx";
//import Value from "📦/ux/Value.tsx";
import Feature from "📦/ux/Feature.tsx";
import { community_all, ranking } from "../data/repo.ts";
import type { Investors } from "📚/repository/mod.ts";
import { DataFrame } from "📚/utils/dataframe.ts";

// import { RepoDiskBackend } from "../../src/storage/mod.ts";
// import { Community, InvestorExport, Names } from "📚/investor/mod.ts";
// import { Ranking } from "📚/ranking/mod.ts";
// import { DateFormat } from "📚/utils/time/mod.ts";
// import { DataFrame } from "📚/utils/dataframe.ts";

export default defineRoute(async (req: Request, ctx: RouteContext) => {
  // // Access to repository
  // const env = await load();
  // const path = env["DATAPATH"] as string;
  // console.log("page path: ", path);
  // const backend = new RepoDiskBackend(path);
  // const community = new Community(backend);

  // // TODO, only return names from last dir
  // const updated = await community.end() as DateFormat;
  // const names: Names = await community.valid(updated);

  // // Ranking
  // const ranking = new Ranking(backend);
  // //await ranking.train();
  // const prediction: DataFrame = await ranking.predict(names);

  const investors: Investors = await community_all();
  const prediction: DataFrame = await ranking();

  // Load all data for each investor
  // const exports: InvestorExport[] = await Promise.all(
  //   names.values.map((name: string) => community.investor(name).export()),
  // );
  // const investors: Record<string, InvestorExport> = Object.assign(
  //   {},
  //   ...names.values.map((name: string, index: number) => ({
  //     [name]: exports[index],
  //   })),
  // );

  // Render component
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
