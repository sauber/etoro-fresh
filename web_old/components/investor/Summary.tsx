//import Avatar from "📦/investor/Avatar.tsx";
import ChartIsland from "🏝️/Chart.tsx";
import InvestorAvatar from "../../../web/islands/investor/Avatar.tsx";
import { ChartExport, InvestorExport, StatsExport } from "📚/investor/mod.ts";
import { portfolioData } from "📚/investor/testdata.ts";
//import Chart from "📦/chart/Small.tsx";

export interface ComponentProps {
  investor: InvestorExport;
  color: string;
  sharpeRatio: number;
  profit: number;
}

export default function InvestorSummary({ investor, color, sharpeRatio, profit }: ComponentProps) {
  const stats: StatsExport = investor.stats;
  const chart: ChartExport = investor.chart;

  return (
    <div style={{ backgroundColor: color }}>
      <ChartIsland
          type="line"
          options={{ interaction: { mode: "index", intersect: false } }}
          data={{
            labels: chart[0],
            datasets: [
              {
                label: "Simulation",
                data: chart[1],
                pointStyle: false,
                borderWidth: 2
              },
            ],
          }}
        />
    <div class="w-20 h-20 inline-block rounded-lg overflow-hidden">
        {stats.HasAvatar && <InvestorAvatar CustomerId={stats.CustomerId as number} />}
      </div>
      <div class="inline-block">
      <p>
        {stats.IsFund && <span>💰</span>}
        {stats.PopularInvestor && <span>⭐</span>}
        {stats.AUMTierDesc}, {stats.Copiers} Copiers
      </p>
      <p>
        {stats.FullName ? stats.FullName + ", " : ""}
        <a
          href={"/investor/" + stats.UserName}
          class="font-mono cursor-pointer"
        >
          {stats.UserName}
        </a>
      </p>
      <p>SharpeRatio: {sharpeRatio.toFixed(2)}, Profit: {profit.toFixed(2)}</p>
      </div>
    </div>
  );
}
