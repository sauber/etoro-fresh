import type { Investors } from "📚/repository/mod.ts";
import { Investor } from "📚/investor/mod.ts";

type Props = {
  investors: Investors;
};

export default function InvestorList({ investors }: Props) {
  console.log({investors});

  return (
    <div>
      <div class="flex items-center flex-1">
        <div class="text-2xl ml-1 font-bold">
          Investor List
        </div>
      </div>
      <ul class="">
        {investors.map((investor: Investor) => (
          <li>
            <a
              href="/investor/{investor.UserName}"
              class="text-gray-500 hover:text-gray-700 py-1 border-gray-500"
            >
              {investor.FullName ? investor.FullName : investor.UserName}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
