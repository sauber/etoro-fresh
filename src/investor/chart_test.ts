import { assertInstanceOf, assertEquals } from "assert";
import { repoBackend, investorId } from "/refresh/testdata.ts";
import { Chart, ChartData } from "./chart.ts";

Deno.test("Initialization", () => {
  const chart = new Chart({simulation:{oneYearAgo:{chart:[]}}});
  assertInstanceOf(chart, Chart);
});

Deno.test("Chart", async (t) => {
  await t.step("validate", async () => {
    const data = await repoBackend.retrieve(investorId.UserName + '.chart') as unknown as ChartData;
    const chart: Chart = new Chart(data);
    assertEquals(chart.validate(), true);
 });
});