import { Head } from "$fresh/runtime.ts";
import { load } from "dotenv";
import { defineRoute, RouteContext } from "$fresh/server.ts";
import { ChartColors } from "$fresh_charts/utils.ts";

import Rankgrid from "📦/community/RankGrid.tsx";
import Value from "📦/visualization/Value.tsx";
import Card from "📦/Card.tsx";
import Feature from "📦/Feature.tsx";
import Chart from "📦/Chart.tsx";

import InvestorAvatar from "🏝️/investor/InvestorAvatar.tsx";

import { RepoDiskBackend } from "📚/repository/mod.ts";
import { Investor, InvestorExport, Names } from "📚/investor/mod.ts";
import { Ranking } from "📚/ranking/mod.ts";
import { DateFormat } from "📚/utils/time/mod.ts";
import { DataFrame } from "📚/utils/dataframe.ts";

export default defineRoute(async (req: Request, ctx: RouteContext) => {
  const UserName = ctx.params.username;

  // Access to repository
  const env = await load();
  const path = env["DATAPATH"] as string;
  const backend = new RepoDiskBackend(path);

  // Load data
  const investor = new Investor(UserName, backend);
  const data: InvestorExport = await investor.export();
  //console.log(data);

  // Render component
  return (
    <>
      <Head>
        <title>Investor {UserName}</title>
      </Head>
      <Feature>
        {data.stats.HasAvatar && (
          <InvestorAvatar CustomerId={data.stats.CustomerId} />
        )}
        <div>{UserName}</div>
        <Chart />
      </Feature>
    </>
  );
});
