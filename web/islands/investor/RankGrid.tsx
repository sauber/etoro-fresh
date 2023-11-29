//import { Handlers, PageProps } from "$fresh/server.ts";
import ListItem from "../../islands/investor/InvestorCell.tsx";
import { useEffect, useState } from "preact/hooks";
import { Grid, Item, Table } from "/utils/grid.ts";

export default function InvestorList() {
  const [getGrid, setGrid] = useState([] as Table);
  const [counter, setCounter] = useState(0);

  const increment = () => setCounter(counter + 1);

  const loadRank = async () => {
    const url = "/api/investor/rank";
    const fetchOptions = {
      headers: {
        accept: "application/json",
      },
    };

    //console.log("Start fetching names");
    const response = await fetch(url, fetchOptions);
    if (response.ok) {
      //console.log("Parsing result");
      const data = await response.json();
      //console.log("data loaded: ", data);
      return data;
      //names.value = data;
    } else {
      console.log("fetch error");
      console.log(response);
      return [];
    }
  };

  const createGrid = (ranks: Array<Record<string, number>>) => {
    const griddata = ranks.map((i) => {
      return { x: i.Profit, y: i.SharpeRatio, content: i };
    });
    const grid = new Grid(griddata);
    grid.optimize();
    //console.table(grid.table);
    return grid;
  };

  useEffect(() => {
    const fetchData = async () => {
      increment();
      const rank = await loadRank();
      const grid = createGrid(rank);
      const table: Table = grid.table;
      console.log({ table });
      setGrid(table);
    };
    fetchData();
    increment();
  }, []);

  return (
    <div>
      <p>CountER: {counter}</p>
      <h2>Rank of investors</h2>
      <table class="border-collapse border-2 border-slate-400">
        {getGrid.map((row) => (
          <tr>
            {row.map((cell) => (
              <td>
                <ListItem
                  UserName={cell
                    ? (cell.content as Record<string, string>).UserName
                    : "null"}
                />
              </td>
            ))}
          </tr>
        ))}
      </table>
    </div>
  );
}
