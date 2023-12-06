import Avatar from "📦/investor/Avatar.tsx";
import InvestorAvatar from "🏝️/investor/InvestorAvatar.tsx";

export interface CommunityProps {
  UserName: string;
}

export default function InvestorSummary(
  { UserName, CustomerId }: CommunityProps,
) {
  return (
    <>
      <div class="w-20 h-20 inline-block rounded-lg overflow-hidden">
        <InvestorAvatar CustomerId={CustomerId} />
      </div>
      <p class="font-jost text-sm p-1 text-gray-900 leading-none">
        {UserName}, {CustomerId}
      </p>
    </>
  );
}
