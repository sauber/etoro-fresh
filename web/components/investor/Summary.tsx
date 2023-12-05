import Avatar from "📦/investor/Avatar.tsx";

export interface CommunityProps {
  UserName: string;
}

export default function InvestorSummary(
  { UserName }: CommunityProps,
) {
  return (
    <>
      <div class="w-10 h-10 inline-block">
        <Avatar CustomerId={10} />
      </div>
      <p class="font-jost text-sm p-1 text-gray-900 leading-none">{UserName}</p>
    </>
  );
}
