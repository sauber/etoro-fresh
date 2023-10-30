import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import type { InvestorExport } from "../../../src/investor/mod.ts";

interface Props {
  UserName: string;
}

export default function InvestorItem({ UserName }: Props) {
  const CustomerId = useSignal(-1);
  const imageUrl = useSignal("");
  const PopularInvestor = useSignal(false);
  const Gain = useSignal(-1);

  const loadInvestor = async () => {
    const url = `/api/investor/${UserName}/last`;
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

  // Confirm if an image is loading
  const testUrl = async (url: string) => {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok ? true : false;
  };

  // Which image is available
  const findImage = async (id: number): Promise<string | undefined> => {
    for (const index of [7, 6, 5, 4, 3, 2, 1]) {
      const sub =
        `https://etoro-cdn.etorostatic.com/avatars/150X150/${id}/${index}.jpg`;
      if (await testUrl(sub)) return sub;
    }
    const base = `https://etoro-cdn.etorostatic.com/avatars/150X150/${id}.jpg`;
    if (await testUrl(base)) return base;
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadInvestor();
      const id = data.stats.CustomerId as number;
      CustomerId.value = id;
      Gain.value = data.stats.Gain as number;
      PopularInvestor.value = data.stats.PopularInvestor as boolean;
      if (data.stats.HasAvatar) {
        const url = await findImage(id);
        if (url) imageUrl.value = url;
      }
    };
    fetchData();
  }, []);

  return (
    <div class="h-8">
      <img class="h-full inline" src={`${imageUrl}`} content=" " />
      {UserName}, CustomerID: {CustomerId}, Gain: {Gain}, Popular: {PopularInvestor.value ? "true" : "false"}
    </div>
  );
}
