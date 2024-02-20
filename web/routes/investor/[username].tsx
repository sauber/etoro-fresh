import { Head } from "$fresh/runtime.ts";
import { defineRoute, RouteContext } from "$fresh/server.ts";
import { Investor } from "📚/investor/mod.ts";
import { investor as getInvestor } from "../../data/repo.ts";
import Feature from "📦/ux/Feature.tsx";
import Details from "📦/investor/Details.tsx";

type StatsProps = {
  title: string;
  data: Record<string, string | number>;
};

export default defineRoute(async (req: Request, ctx: RouteContext) => {
  const UserName: string = ctx.params.username;
  const investor: Investor = await getInvestor(UserName);

  return (
    <>
      <Head>
        <title>Investor {investor.UserName}</title>
      </Head>
      <Feature>
        <Details investor={investor} />
      </Feature>
    </>
  );
});
