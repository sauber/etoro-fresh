import type { Investors } from "📚/repository/mod.ts";
import { Investor } from "📚/investor/mod.ts";
import Avatar from "🏝️/investor/Avatar.tsx";

type Props = {
  investors: Investors;
};

export default function InvestorList({ investors }: Props) {
  //console.log({investors});

  return (
    <div>
      <div class="text-2xl ml-1 font-bold">
        Investor List
      </div>
      <table>
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Name</th>
            <th>Fund / Popular</th>
            <th>Copiers</th>
          </tr>
        </thead>
        <tbody>
          {investors.map((investor: Investor) => (
            <tr>
              <td class="h-8"><Avatar CustomerId={investor.CustomerID} /></td>
              <td>
                <a
                  href={"/investor/" + investor.UserName}
                  class="text-gray-500 hover:text-gray-700 py-1 border-gray-500"
                >
                  {investor.FullName ? investor.FullName : investor.UserName}
                </a>
              </td>
              <td>
                {investor.isFund && <span>💰</span>}
                {investor.isPopularInvestor && <span>⭐</span>}
              </td>
              <td>{investor.stats.last.AUMTierDesc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
