import { CachingBackend, DiskBackend } from "📚/storage/mod.ts";
import { Community } from "📚/repository/mod.ts";
import { CrossPath } from "./cross-path.ts";
import type { DateFormat } from "📚/utils/time/mod.ts";

type Position = {
  date: DateFormat;
  value: number;
};

// Community Repo
const path: string = Deno.args[0];
const disk = new DiskBackend(path);
const repo = new CachingBackend(disk);
const community = new Community(repo);

// Charts
const t1: number = performance.now();
const charts = await community.allCharts();
const loadingTime: number = performance.now() - t1;
console.log("Loaded", charts.length, "charts in", loadingTime, "ms");

// Accumulated profit
let acc = 0;

charts.forEach((chart, index) => {
  let position: Position | null = null;
  const strategy = new CrossPath(chart, 20, 50);
  const dates: DateFormat[] = strategy.dates;
  dates.forEach((date: DateFormat) => {
    const signal: number = strategy.value(date);
    if (signal > 0 && !position) {
      // Have no position, so open one
      position = { date: date, value: 1000 * signal };
    } else if (signal < 0 && position) {
      // Close existing position
      const profit = position.value * chart.gain(position.date, date);
      console.log(
        `Chart ${index} Profit ${position.date} to ${date}: ${profit}`,
      );
      position = null;
      acc += profit;
    }
  });
});

console.log(`Total profit: ${acc}`);
