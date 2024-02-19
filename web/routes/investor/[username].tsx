import { Head } from "$fresh/runtime.ts";
import { defineRoute, RouteContext } from "$fresh/server.ts";
import { Investor } from "📚/investor/mod.ts";
import { investor as getInvestor } from "../../data/repo.ts";
import Feature from "📦/ux/Feature.tsx";
import Investor from "📦/investor/Details.tsx";

//import Chart from "🏝️/investor/Chart.tsx";
//import Avatar from "🏝️/investor/Avatar.tsx";

type StatsProps = {
  title: string;
  data: Record<string, string | number>;
};

function StatsBox({ title, data }: StatsProps) {
  return (
    <>
      <h2 class="py-1">{title}</h2>
      <table>
        {Object.entries(data).map(([key, value]) => (
          <tr>
            <th>{key}</th>
            <td>{value}</td>
          </tr>
        ))}
      </table>
    </>
  );
}

export default defineRoute(async (req: Request, ctx: RouteContext) => {
  const UserName: string = ctx.params.username;
  const investor: Investor = await getInvestor(UserName);
  // const chart = investor.chart;
  // const stats = investor.stats.last;
  // const mirrors = investor.mirrors.last;
  // const link: string = "http://etoro.com/people/" + UserName.toLowerCase();
  // const apy: number = +(100*chart.apy).toFixed(2);
  // const sr: number = +chart.sharpeRatio(0.05).toPrecision(4);

  return (
    <>
      <Head>
        <title>Investor {investor.UserName}</title>
      </Head>
      <Feature>
        <Investor investor={investor} />
      </Feature>
    </>
  );
});
