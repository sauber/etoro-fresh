import { assertInstanceOf, assert } from "assert";
import { Repo } from "./repo.ts";
import { Chart, ChartData } from "./chart.ts";
import { username, cis } from "./testdata.ts";

Deno.test("Chart", async (t) => {
  const repo = await Repo.tmp();
  const chart: Chart = new Chart(repo, username, cis);
  assertInstanceOf(chart, Chart);

  await t.step("recent", async () => {
    const data: ChartData = await chart.recent();
    assert(data.simulation.oneYearAgo.chart.length > 370);
  });

  await repo.delete();
});