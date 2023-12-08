import { Chart } from "https://deno.land/x/fresh_charts@0.3.1/mod.ts";
import {
  ChartColors,
  transparentize,
} from "https://deno.land/x/fresh_charts@0.3.1/utils.ts";

export default function ChartExample() {
  return (
    <div>
      <h1>Chart Example</h1>
      <Chart
        type="line"
        options={{
          scales: { yAxes: [{ ticks: { beginAtZero: true } }] },
        }}
        data={{
          labels: ["1", "2", "3"],
          datasets: [{
            label: "Sessions",
            data: [123, 234, 234],
            borderColor: ChartColors.Red,
            backgroundColor: transparentize(ChartColors.Red, 0.5),
            borderWidth: 1,
          }, {
            label: "Users",
            data: [346, 233, 123],
            borderColor: ChartColors.Blue,
            backgroundColor: transparentize(ChartColors.Blue, 0.5),
            borderWidth: 1,
          }],
        }}
      />
    </div>
  );
}
