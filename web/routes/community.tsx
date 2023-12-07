import { Head } from "$fresh/runtime.ts";
import { load } from "dotenv";
import { defineRoute, RouteContext } from "$fresh/server.ts";

import Rankgrid from "📦/community/RankGrid.tsx";
import Value from "📦/visualization/Value.tsx";
import Card from "📦/Card.tsx";

import { RepoDiskBackend } from "📚/repository/mod.ts";
import { Community, InvestorExport, Names } from "📚/investor/mod.ts";
import { Ranking } from "📚/ranking/mod.ts";
import { DateFormat } from "📚/utils/time/mod.ts";
import { DataFrame } from "📚/utils/dataframe.ts";

export default defineRoute(async (req: Request, ctx: RouteContext) => {
  // Access to repository
  const env = await load();
  const path = env["DATAPATH"] as string;
  console.log("page path: ", path);
  const backend = new RepoDiskBackend(path);
  const community = new Community(backend);

  // TODO, only return names from last dir
  const names: Names = await community.names();

  // Ranking
  const ranking = new Ranking(backend);
  await ranking.train();
  const updated = await community.end() as DateFormat;
  const prediction: DataFrame = await ranking.predict(names);

  // Load all data for each investor
  const exports: InvestorExport[] = await Promise.all(
    names.values.map((name: string) => community.investor(name).export()),
  );
  const investors: Record<string, InvestorExport> = Object.assign(
    {},
    ...names.values.map((name: string, index: number) => ({
      [name]: exports[index],
    })),
  );

  // Render component
  return (
    <>
      <Head>
        <title>Investor Community</title>
      </Head>
      <main class="bg-gray-200 px-2 py-2 pb-6">
        <div class="container mx-auto">
          <Card>
            <Value label="Updated" value={updated} />
          </Card>
          <Card>
            <Value
              label="Investors"
              value={Object.keys(investors).length}
            />
          </Card>
          <Card>
            <Rankgrid rank={prediction} investors={investors} />
          </Card>
        </div>
      </main>
    </>
  );
});
