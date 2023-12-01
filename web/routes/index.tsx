import { Handlers, PageProps } from "$fresh/server.ts";

import { asset, Head } from "$fresh/runtime.ts";
import { load } from "dotenv";

import { RepoDiskBackend } from "/repository/mod.ts";

import Rankgrid from "../islands/investor/RankGrid.tsx";
import Updated from "../components/community/updated.tsx";
import { Community } from "/investor/mod.ts";
import { Ranking } from "/ranking/mod.ts";
import { DateFormat } from "🛠️/time/mod.ts";

interface HomeProps {
  community: Community;
  ranking: Ranking;
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

    const res: HomeProps = {
      community, ranking, updated
    };
    //console.log({res});

    return ctx.render(res);
  },
};

export default function Home({ data }: PageProps<HomeProps>) {
  console.log(data);
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <main class="bg-gray-200 px-2 py-2 pb-6">
        <div class="container mx-auto">
          <Updated date={data.updated}/>
          <Rankgrid />
        </div>
      </main>
    </>
  );
}
