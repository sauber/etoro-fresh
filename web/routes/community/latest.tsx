import { defineRoute } from "$fresh/server.ts";
import type { Investors } from "📚/repository/mod.ts";
import { community_latest } from "../../data/repo.ts"
import InvestorList from "📦/community/List.tsx";

export default defineRoute(async (req, ctx) => {
  /** Load list of latest investors */
  const list: Investors = await community_latest();
  console.log('Investor latest count:', list.length);

  return (
    <div class="page">
      <h1>Latest Investor Count: {list.length}</h1>
      <InvestorList investors={list} />
    </div>
  );
});
