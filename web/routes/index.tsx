import { Handlers, PageProps } from "$fresh/server.ts";

import { asset, Head } from "$fresh/runtime.ts";
import { load } from "dotenv";

import { RepoDiskBackend } from "📚/repository/mod.ts";

import Rankgrid from "../components/community/RankGrid.tsx";
import Value from "../components/visualization/Value.tsx";
import Card from "📦/Card.tsx";
import { Community, Names } from "📚/investor/mod.ts";
import { Ranking } from "📚/ranking/mod.ts";
import { DateFormat } from "📚/utils/time/mod.ts";
import { DataFrame } from "📚/utils/dataframe.ts";

interface HomeProps {
  prediction: DataFrame;
  updated: DateFormat;
}

export const handler: Handlers<HomeProps> = {
  async GET(req, ctx) {
    const env = await load();
    const path = env["DATAPATH"] as string;
    console.log("page path: ", path);
    const backend = new RepoDiskBackend(path);
    const community = new Community(backend);
    const ranking = new Ranking(backend);
    const updated = await community.end() as DateFormat;

    // TODO, only return names from last dir
    const names: Names = await community.names();
    const prediction: DataFrame = await ranking.predict(names);

    const res: HomeProps = {
      updated, prediction
    };
    //console.log({res});

    return ctx.render(res);
  },
};

export default function Home({ data }: PageProps<HomeProps>) {
  //console.log(data);
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <main class="bg-gray-200 px-2 py-2 pb-6">
        <div class="container mx-auto">
          <Card>
            <Value label="Updated" value={data.updated}/>
          </Card>
          <Card>
            <Rankgrid rank={data.prediction} />
          </Card>
        </div>
      </main>
    </>
  );
}
