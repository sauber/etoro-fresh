import { assertInstanceOf, assert } from "assert";
import { Repo } from "./repo.ts";
import { Chart, ChartData } from "./chart.ts";

Deno.test("Chart", async (t) => {
  const repo = await Repo.tmp();
  const username = "JeppeKirkBonde";
  const cis = 2988943;
  const chart: Chart = new Chart(repo, username, cis);
  assertInstanceOf(chart, Chart);

  await t.step("recent", async () => {
    const data: ChartData = await chart.recent();
    assert(data.simulation.oneYearAgo.chart.length > 370);
  });

  await repo.delete();
});