import { CachingBackend, DiskBackend } from "📚/storage/mod.ts";
import { Community } from "📚/repository/mod.ts";
import { CrossPath } from "./cross-path.ts";
import type { DateFormat } from "📚/utils/time/mod.ts";
import { diffDate } from "📚/utils/time/mod.ts";
import { avg } from "📚/chart/statistics.ts";

type Position = {
  date: DateFormat;
  value: number;
};

function run(fast: number, slow: number): number {
  console.log("Testing with fast:", fast, "slow:", slow);
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
    console.log("Fast:", fast, "Slow:", slow);
    console.log("  Total profit:", acc.toFixed(2));
    console.log(
      "  Wins:",
      wins,
      "Losses:",
      losses,
      "Winratio:",
      (100 * wins / (wins + losses)).toFixed(2),
    );
    console.log("  Average duration:", avg(duration).toFixed(2), "days");
  }

  /** Loop all dates in all charts */
  charts.forEach((chart, _index) => {
    let position: Position | null = null;
    const strategy = new CrossPath(chart, fast, slow);
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
        // console.log(
        //   `Chart ${index} Profit ${position.date} to ${date}: ${profit}`,
        // );
        position = null;
      }
    });
  });

  results();
  // const loss = 1 / acc;
  return acc;
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

// run(2, 20);
// run(5, 50);
// run(10, 100);
// run(20, 200);

let fast = 5;
let slow = 60;

while (true) {
  const gain = run(fast, slow);

  // Decide if fast should be higher or lower
  let nextFast = fast;
  const fh = run(fast+1, slow);
  if ( fh > gain ) { nextFast = fast + 1}
  else { 
    const fl = run(fast-1, slow);
    if ( fl > gain ) { nextFast = fast - 1}
  };

  
  // Decide if slow should be higher or lower
  let nextSlow = slow;
  const sh = run(fast, slow+1);
  if ( sh > gain ) { nextSlow = slow + 1}
  else { 
    const sl = run(fast, slow-1);
    if ( sl > gain ) { nextSlow = slow - 1}
  };

  // No change to fast and slow
  console.log({fast, nextFast, slow, nextSlow});
  if ( nextFast == fast && nextSlow == slow ) break;
  fast = nextFast;
  slow = nextSlow;
}
