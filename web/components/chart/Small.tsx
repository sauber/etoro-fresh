import { Chart } from "$fresh_charts/mod.ts";
//import { ChartColors, transparentize } from "$fresh_charts/utils.ts";
import { ChartExport } from "/investor/mod.ts";

type ComponentPros = {
  chart: ChartExport;
};

export default function ChartExample({ chart }: ComponentProps) {
  const labels = chart[0];
  const values = chart[1];
  //console.log({ labels, values });

  return (
    <Chart
      style="width: 100%; height: 100%"
      type="line"
      //options={{ scales: { y: { beginAtZero: true } } }}
      options={{
        scales: {
          x: { display: false },
          y: { display: false, beginAtZero: true },
        },
      }}
      //width="300"
      //height="150"
      maintainAspectRatio="true"
      data={{
        //normalized: true,
        parsing: false,
        labels: labels,
        datasets: [{
          label: "Simulation",
          data: values,
          //borderColor: ChartColors.Red,
          //backgroundColor: transparentize(ChartColors.Red, 0.5),
          borderWidth: 2,
          radius: 0,
        }],
      }}
    />
  );
}
