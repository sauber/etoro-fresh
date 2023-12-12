import { Head } from "$fresh/runtime.ts";
import { load } from "dotenv";
import { defineRoute, RouteContext } from "$fresh/server.ts";
//import { ChartColors } from "$fresh_charts/utils.ts";

import Rankgrid from "📦/community/RankGrid.tsx";
import Value from "📦/visualization/Value.tsx";
import Card from "📦/Card.tsx";
import Feature from "📦/Feature.tsx";
//import Chart from "📦/chart/Full.tsx";
import ChartIsland from "🏝️/Chart.tsx";
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
  const stats = data.stats;
  const chart = data.chart;

  // Render component
  return (
    <>
      <Head>
        <title>Investor {UserName}</title>
      </Head>
      <Feature>
        <div class="flex">
          <div>
            {data.stats.HasAvatar && (
              <InvestorAvatar CustomerId={data.stats.CustomerId as number} />
            )}
          </div>
          <div>
            <p>
              {stats.FullName ? stats.FullName + ", " : ""}
              <a
                href={"/investor/" + stats.UserName}
                class="font-mono cursor-pointer"
              >
                {stats.UserName}
              </a>
            </p>
            <p>
              {stats.IsFund && <span>💰</span>}
              {stats.PopularInvestor && <span>⭐</span>}
              {stats.AUMTierDesc}, {stats.Copiers} Copiers
            </p>
          </div>
        </div>
        <ChartIsland
          type="line"
          options={{ interaction: { mode: "index", intersect: false } }}
          data={{
            labels: chart[0],
            datasets: [
              {
                label: "Simulation",
                data: chart[1],
                pointStyle: false,
                borderWidth: 2
              },
            ],
          }}
        />
      </Feature>
    </>
  );
});
