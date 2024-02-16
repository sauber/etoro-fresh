import { defineRoute, RouteContext } from "$fresh/server.ts";
import { Investor } from "📚/investor/mod.ts";
import { investor as getInvestor } from "../../data/repo.ts";

export default defineRoute(async (req: Request, ctx: RouteContext) => {
  const UserName = ctx.params.username;
  const investor: Investor = getInvestor(UserName);

  return ();
});