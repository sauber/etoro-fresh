import { CachingBackend, DiskBackend } from "📚/storage/mod.ts";
import { Community } from "📚/repository/mod.ts";
import { CrossPath } from "./cross-path.ts";
import type { DateFormat } from "📚/utils/time/mod.ts";
import { diffDate } from "📚/utils/time/mod.ts";
import { avg } from "📚/chart/statistics.ts"

type Position = {
  date: DateFormat;
  value: number;
};

// Accumulated profit
let acc = 0;
let wins = 0;
let losses = 0;
const duration: Array<number> = [];

/** Record results when closing position */
function close(start: DateFormat, end: DateFormat, profit: number): void {
  acc += profit;
  if (profit > 0) ++wins;
  if (profit < 0) ++losses;
  duration.push(diffDate(start, end));
}

/** Display results */
function results(): void {
  console.log("Total profit:", acc.toFixed(2));
  console.log(
    "Wins:",
    wins,
    "Losses:",
    losses,
    "Winratio:",
    (100 * wins / (wins + losses)).toFixed(2),
  );
  console.log("Average duration:", avg(duration).toFixed(2), 'days');
}

/** Loop all dates in all charts */
function run(): void {
  charts.forEach((chart, index) => {
    let position: Position | null = null;
    const strategy = new CrossPath(chart, 5, 50);
    const dates: DateFormat[] = strategy.dates;
    dates.forEach((date: DateFormat) => {
      const signal: number = strategy.value(date);
      if (signal > 0 && !position) {
        // Have no position, so open one
        position = { date: date, value: 1000 * signal };
      } else if (signal < 0 && position) {
        // Close existing position
        const profit = position.value * chart.gain(position.date, date);
        close(position.date, date, profit);
        console.log(
          `Chart ${index} Profit ${position.date} to ${date}: ${profit}`,
        );
        position = null;
      }
    });
  });
}

// Community Repo
const path: string = Deno.args[0];
const disk = new DiskBackend(path);
const repo = new CachingBackend(disk);
const community = new Community(repo);

// Load Charts
const t1: number = performance.now();
const charts = await community.allCharts();
const loadingTime: number = performance.now() - t1;
console.log("Loaded", charts.length, "charts in", loadingTime, "ms");

run();
results();
