import Avatar from "📦/investor/Avatar.tsx";
import InvestorAvatar from "🏝️/investor/InvestorAvatar.tsx";
import { InvestorExport, StatsExport } from "📚/investor/mod.ts";

export interface ComponentProps {
  investor: InvestorExport;
  color: string;
}

export default function InvestorSummary({ investor, color }: ComponentProps) {
  const stats: StatsExport = investor.stats;

  return (
    <div style={"background-color: " + color}>
      <div class="w-20 h-20 inline-block rounded-lg overflow-hidden">
        {stats.HasAvatar && <InvestorAvatar CustomerId={stats.CustomerId} />}
      </div>
      <p>
        {stats.IsFund && <span>💰</span>}
        {stats.PopularInvestor && <span>⭐</span>}
        {stats.AUMTierDesc}, {stats.Copiers} Copiers
      </p>
      <p>
        {stats.FullName ? stats.FullName + ", " : ""}
        <span class="font-mono">{stats.UserName}</span>
      </p>
    </div>
  );
}
