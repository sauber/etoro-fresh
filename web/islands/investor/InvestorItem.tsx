import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import type { InvestorExport } from "../../../src/investor/mod.ts";
import InvestorAvatar from "./InvestorAvatar.tsx";

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
  else {return (
      <div class="h-8">
        {InvestorData.value.stats.HasAvatar
          ? <InvestorAvatar CustomerId={CustomerId.value as number} />
          : ""}

        {UserName}, CustomerID: {CustomerId}, Gain:
        {InvestorData.value.stats.Gain}, Avatar:
        {InvestorData.value.stats.HasAvatar ? "true" : "false"}
      </div>
    );}
}
