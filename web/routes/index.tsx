import { asset, Head } from "$fresh/runtime.ts";

//import InvestorList from "../islands/investor/InvestorList.tsx";
import Rankgrid from "../islands/investor/RankGrid.tsx";

export default function Home() {
  const date = new Date();
  date.setMinutes(date.getMinutes() + 1);

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <main class="bg-gray-200 px-2 py-2 pb-6">
        <div class="container mx-auto">
          <Rankgrid />
        </div>
      </main>
    </>
  );
}
