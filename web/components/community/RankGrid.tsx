import { Grid, Item, Line, Table } from "📚/utils/grid.ts";
import { DataFrame, RowRecord, RowRecords } from "📚/utils/dataframe.ts";
import Card from "📦/investor/Summary.tsx";

export interface ComponentProps {
  rank: DataFrame;
  investors: Record<string, number>;
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
  const ProfitRange = MinMax(records.map((i: RowRecord) => i.Profit));
  const SharpeRange = MinMax(records.map((i: RowRecord) => i.SharpeRatio));
  records.forEach((i: RowRecord) => {
    const profitMax = ProfitRange[i.Profit >= 0 ? 1 : 0];
    const h = i.Profit > 0 ? 75 : 0;
    const l = 10 + 50 * i.Profit / profitMax;
    let s = 0;
    if (i.Profit >= 0) {
      s = 1 -
        (i.SharpeRatio - SharpeRange[0]) / (SharpeRange[1] - SharpeRange[0]);
    } else {
      s = (i.SharpeRatio - SharpeRange[0]) / (SharpeRange[1] - SharpeRange[0]);
    }
    s = 100 * s;
    const rgb = HSLToHex({ h, s, l });
    i.color = rgb;
  });

  // Distribute investors into a grid
  const griddata = records.map((i: RowRecord) => {
    return { y: i.Profit, x: i.SharpeRatio, content: i };
  });
  const grid = new Grid(griddata);
  grid.optimize();
  const table: Table = grid.table;

  // Size of grid
  const rowCount: number = table.length;
  const colCount: number = table[0].length;

  return (
    <>
      <h2>Rank of investors</h2>
      <table class="border-collapse border-2 border-slate-400">
        {table.map((row: Line, index: number) => (
          <tr>
            {index == 0 && <th rowspan={rowCount} class="transform rotate-180" style={{ writingMode: 'vertical-rl' }}>Predicted Profit</th>}
            {row.map((cell: Item) => (
              <td class="border-2 border-slate-200">
                {cell && (
                  <Card
                    investor={investors[cell.content.UserName]}
                    color={cell.content.color}
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
