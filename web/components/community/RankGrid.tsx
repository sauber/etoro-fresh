import { Grid, Item, Line, Table, DataSet } from "📚/utils/grid.ts";
import { DataFrame, RowRecord, RowRecords } from "dataframe.ts";
import type { Investors } from "📚/repository/mod.ts";
import { Investor } from "📚/investor/mod.ts";
import Card from "📦/investor/Summary.tsx";

export interface ComponentProps {
  rank: DataFrame;
  investors: Investors;
}

function HSLToHex(hsl: { h: number; s: number; l: number }): string {
  const { h, s, l } = hsl;

  const hDecimal = l / 100;
  const a = (s * Math.min(hDecimal, 1 - hDecimal)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = hDecimal - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);

    // Convert to Hex and prefix with "0" if required
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function MinMax(n: number[]): [number, number] {
  return [Math.min(...n), Math.max(...n)];
}

export default function InvestorGrid({ rank, investors }: ComponentProps) {
  const records: RowRecords = rank.records;

  // Decide a color code for each item
  const ProfitRange: [number, number] = MinMax(records.map((i: RowRecord) => i.Profit as number));
  const SharpeRange: [number, number] = MinMax(records.map((i: RowRecord) => i.SharpeRatio as number));
  records.forEach((i: RowRecord) => {
    const profit = i.Profit as number;
    const sharperatio = i.SharpeRatio as number;
    const profitMax = ProfitRange[profit >= 0 ? 1 : 0];
    const h = profit > 0 ? 75 : 0;
    const l = 10 + 50 * profit / profitMax;
    let s = 0;
    if (profit >= 0) {
      s = 1 -
        (sharperatio - SharpeRange[0]) / (SharpeRange[1] - SharpeRange[0]);
    } else {
      s = (sharperatio - SharpeRange[0]) / (SharpeRange[1] - SharpeRange[0]);
    }
    s = 100 * s;
    const rgb = HSLToHex({ h, s, l });
    i.color = rgb;
  });

  // Distribute investors into a grid
  const griddata: DataSet = records.map((i: RowRecord) => {
    return { y: (i.Profit as number), x: (i.SharpeRatio as number), content: i };
  });
  const grid = new Grid(griddata);
  grid.optimize();
  const table: Table = grid.table;

  // Size of grid
  const rowCount: number = table.length;
  const colCount: number = table[0].length;

  // Create dict of investors
  const InvDict: Record<string, Investor> = {};
  investors.forEach(investor => InvDict[investor.UserName] = investor);

  return (
    <>
      <h2>Rank of investors</h2>
      <table class="border-collapse border-2 border-slate-400">
        {table.map((row: Line, index: number) => (
          <tr>
            {index == 0 && <th rowspan={rowCount} class="transform rotate-180" style={{ writingMode: 'vertical-rl' }}>Predicted Profit</th>}
            {row.map((cell: Item | null) => (
              <td class="border-2 border-slate-200">
                {cell && (
                  <Card
                    investor={InvDict[(cell.content as RowRecord).UserName as string]}
                    color={(cell.content as RowRecord).color as string}
                    sharpeRatio={cell.x}
                    profit={cell.y}
                  />
                )}
              </td>
            ))}
          </tr>
        ))}
        <tr><td /><th colspan={colCount}>Predicted Sharpe Ratio</th></tr>
      </table>
    </>
  );
}
