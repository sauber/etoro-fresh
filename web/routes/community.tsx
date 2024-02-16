import { defineRoute } from "$fresh/server.ts";
import type { Investors } from "📚/repository/mod.ts";
import { Investor } from "📚/investor/investor.ts";
import { community_latest } from "../data/repo.ts"

export default defineRoute(async (req, ctx) => {
  /** Load list of latest investors */
  const data: Investors = await community_latest();
  console.log('Investor count:', data.length);
  const investor: Investor = data[0];

  return (
    <div class="page">
      <h1>Investor Count: {data.length}</h1>
      <h2>First Investors</h2>
      <p>UserName: {investor.UserName}</p>
      <p>Full Name: {investor.FullName}</p>
    </div>
  );
});
