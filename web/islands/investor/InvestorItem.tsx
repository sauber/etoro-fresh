import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import type { InvestorExport } from "../../../src/investor/mod.ts";

interface Props {
  UserName: string
}

export default function InvestorItem({ UserName }: Props) {
  const investorData = useSignal(-1);
  const imageUrl = useSignal('https://etoro-cdn.etorostatic.com/avatars/150X150/6216244/4.jpg');

  const loadInvestor = async () => {
    const url = `/api/investor/${UserName}/last`;
    const fetchOptions = {
      headers: {
        accept: "application/json",
      },
    };
    const response = await fetch(url, fetchOptions);
    if ( response.ok ) {
      const data = await response.json() as InvestorExport;
      //investorData.value = data.stats.CustomerId as number;
      return data;
    } else {
      console.log('fetch error: ', response);
      return { stats: { CustomerId: -1 }};
    }
  }

    useEffect(() => {
    const fetchData = async () => {
      const data = await loadInvestor();
      investorData.value = data.stats.CustomerId as number;
      imageUrl.value = `https://etoro-cdn.etorostatic.com/avatars/150X150/${data.stats.CustomerId}/2.jpg`;
    };
    fetchData();
  }, []);

  return <div class="h-8">
    <img class="h-full inline" src={`${imageUrl}`} />
    Name: {UserName}, CustomerID: {investorData}
  </div>
}

