import { Head } from "$fresh/runtime.ts";
import { defineRoute, RouteContext } from "$fresh/server.ts";
import { Investor } from "📚/investor/mod.ts";
import { investor as getInvestor } from "../../data/repo.ts";
import Feature from "📦/ux/Feature.tsx";
import Chart from "🏝️/investor/Chart.tsx";
import Avatar from "🏝️/investor/Avatar.tsx";

export default defineRoute(async (req: Request, ctx: RouteContext) => {
  const UserName = ctx.params.username;
  const investor: Investor = await getInvestor(UserName);
  const chart = investor.chart.values;
  const dates = investor.chart.dates;
  //console.log({dates, chart});

  return (
    <>
      <Head>
        <title>Investor {investor.UserName}</title>
      </Head>
      <Feature>
        <div class="h-64 w-full">
          <Chart
            type="line"
            options={{ interaction: { mode: "index", intersect: false } }}
            data={{
              labels: dates,
              datasets: [
                {
                  label: "Simulation",
                  data: chart,
                  pointStyle: false,
                  borderWidth: 2,
                },
              ],
            }}
          />
        </div>
        <Avatar CustomerId={investor.CustomerID} />

        <div class="flex">

          <div>
            <p>
              {investor.FullName ? investor.FullName + ", " : ""}
              <a
                href={"/investor/" + investor.UserName}
                class="font-mono cursor-pointer"
              >
                {investor.UserName}
              </a>
            </p>
          </div>
        </div>
      </Feature>
    </>
  );
});
