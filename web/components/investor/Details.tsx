import { Investor } from "📚/investor/mod.ts";
import Chart from "🏝️/investor/Chart.tsx";
import Avatar from "🏝️/investor/Avatar.tsx";

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
            <th class="text-sm">{key}</th>
            <td class="text-sm">{value}</td>
          </tr>
        ))}
      </table>
    </>
  );
}

type InvestorProps = {
  investor: Investor;
};

export default function InvestorDetails({investor}: InvestorProps) {
  const UserName: string = investor.UserName;
  const chart = investor.chart;
  const stats = investor.stats.last;
  const mirrors = investor.mirrors.last;
  const link: string = "http://etoro.com/people/" + UserName.toLowerCase();
  const apy: number = +(100*chart.apy).toFixed(2);
  const sr: number = +chart.sharpeRatio(0.05).toPrecision(4);

return (
<div class="grid">
<div class="flex flex-col col-span-4 items-center justify-center">
  <Chart
    type="line"
    options={{ interaction: { mode: "index", intersect: false } }}
    data={{
      labels: chart.dates,
      datasets: [
        {
          label: "Simulation",
          data: chart.values,
          pointStyle: false,
          borderWidth: 2,
        },
      ],
    }}
  />
</div>

<div class="flex flex-col rounded-xl bg-neutral-700 m-2 p-2 border-2">
  <h2 class="py-1">Profile</h2>
  <p>
    {investor.FullName ? investor.FullName + ", " : ""}
    <a
      href={"/investor/" + investor.UserName}
      class="font-mono cursor-pointer"
    >
      {investor.UserName}
    </a>
  </p>
  <p>
    <a href={link}>{link}</a>
  </p>
  <div>
    <Avatar CustomerId={investor.CustomerID} />
  </div>
</div>

<div class="flex flex-col rounded-xl bg-neutral-700 m-2 p-2 border-2">
  <StatsBox
    title="Social"
    data={{
      "Copiers": stats.Copiers,
      "Copiers Gain": stats.CopiersGain,
      "Copy Value": stats.AUMTierDesc,
      "Fund": stats.IsFund ? "💰" : "",
      "Popular Investor": stats.PopularInvestor ? "⭐" : "",
      "Mirrors": mirrors.length,
    }}
  />
</div>

<div class="flex flex-col rounded-xl bg-neutral-700 m-2 p-2 border-2">
  <StatsBox
    title="Trading"
    data={{
      "Active Weeks": stats.ActiveWeeks,
      "Active Weeks Pct": stats.ActiveWeeksPct,
      "Average Position Size": stats.AvgPosSize,
      "Exposure": stats.Exposure,
      "High Leverage Pct": stats.HighLeveragePct,
      "Medium Leverage Pct": stats.MediumLeveragePct,
      "Low Leverage Pct": stats.LowLeveragePct,
      "Long Position Pct": stats.LongPosPct,
      "Risk Score": stats.RiskScore,
      "Trades": stats.Trades,
    }}
  />
</div>

<div class="flex flex-col rounded-xl bg-neutral-700 m-2 p-2 border-2">
  <StatsBox
    title="Results"
    data={{
      "APY": apy,
      "Daily Max Drawdown": stats.DailyDD,
      "Gain": stats.Gain,
      "Peak To Valley": stats.PeakToValley,
      "Profitable Weeks Pct": stats.ProfitableWeeksPct,
      "Sharpe Ratio": sr,
      "Weekly Max Drawdown": stats.WeeklyDD,
      "Winning Ratio": stats.WinRatio,
    }}
  />
</div>
</div>
)};
