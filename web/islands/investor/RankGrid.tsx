//import { Handlers, PageProps } from "$fresh/server.ts";
import ListItem from "../../islands/investor/InvestorItem.tsx";
import { useEffect, useState } from "preact/hooks";
import { Grid, Item } from "/utils/grid.ts";

export default function InvestorList() {
  const [getGrid, setGrid] = useState([]);
  const [ counter, setCounter ] = useState(0);

  const increment = () => setCount(counter + 1);

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

  const createGrid = (ranks: Item[]) => {
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
      //const rank = await loadRank();
      //const grid = createGrid(rank);
      //console.log('grid:', grid.table);
      //setGrid(grid.table);
    };
    fetchData();
    increment();
  }, []);

  return (
    <div>
      <p>CountER: {counter}</p>
      <h2>Rank of investors</h2>
      {getGrid.toString()}
      <table class="border-collapse border border-slate-400">
        {getGrid.map((row) => (
          <tr>
            {row.map((cell) => (
              <td>
                {cell.toString()}
                <ListItem UserName={cell.content.UserName} />
              </td>
            ))}
          </tr>
        ))}
      </table>
    </div>
  );
}
