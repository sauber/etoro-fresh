import { Grid, Item, Table } from "📚/utils/grid.ts";
import { DataFrame, RowRecord, RowRecords } from "📚/utils/dataframe.ts";

import Card from "🏝️/investor/InvestorCell.tsx";

export interface ComponentProps {
  rank: Community;
  investors: Record<string, number>;
}

export default function InvestorList({ rank, investors }: ComponentProps) {
  const records: RowRecords = rank.records;

  const griddata = records.map((i) => {
    return { x: i.Profit, y: i.SharpeRatio, content: i };
  });
  const grid = new Grid(griddata);
  grid.optimize();
  const table: Table = grid.table;
  //console.table(grid.table);
  //return grid;

  return (
    <article class="flex justify-start items-start group">
      <div class="bg-white 
      border border(gray-500 opacity-50) rounded-lg 
      shadow-md hover:(shadow-lg border-gray-400)
      transition transition[colors,shadow] duration-200 ease-out
      overflow-hidden">
        <h2>Rank of investors</h2>
        <table class="border-collapse border-2 border-slate-400">
          {table.map((row) => (
            <tr>
              {row.map((cell) => (
                <td class="border-2 border-slate-200">
                  <InvestorCell cell={cell} ids={investors} />
                </td>
              ))}
            </tr>
          ))}
        </table>
      </div>
    </article>
  );
}

/*
{cell !== null &&
  (
    <Card
      UserName={(cell.content as Record<string, string>)
        .UserName}
      CustomerId={investors[username]}
    />
  )}
*/

function InvestorCell(props) {
  if (!props.cell) return ("");
  const username: string =
    (props.cell.content as Record<string, string>).UserName;
  return <Card UserName={username} CustomerId={props.ids[username]} />;
}
