import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import type { InvestorExport } from "📚/investor/mod.ts";
import Avatar from "🏝️/investor/InvestorAvatar.tsx";

interface Props {
  UserName: string;
}

export default function InvestorItem({ UserName }: Props) {
  const CustomerId = useSignal<null | number>(null);
  const InvestorData = useSignal<InvestorExport | null>(null);

  const loadInvestor = async () => {
    const url = `/api/investor/${UserName}/stats`;
    const fetchOptions = {
      headers: {
        accept: "application/json",
      },
    };
    const response = await fetch(url, fetchOptions);
    if (response.ok) {
      const data = await response.json() as InvestorExport;
      //investorData.value = data.stats.CustomerId as number;
      return data;
    } else {
      console.log("fetch error: ", response);
      return { stats: { CustomerId: -1 } };
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadInvestor();
      const id = data.stats.CustomerId as number;
      CustomerId.value = id;
      InvestorData.value = data as InvestorExport;
    };
    fetchData();
  }, []);

  if (InvestorData.value == null) return <div>Loading {UserName}...</div>;
  else {
    const stats = InvestorData.value.stats;
    return (
      <div>
        <div class="w-10 h-10 block">
          <Avatar CustomerId={CustomerId.value as number} />
        </div>
        <div class="inline">
          {stats.FullName}, {UserName}, {stats.PopularInvestor.toString()}
        </div>
      </div>
    );
  }
}
