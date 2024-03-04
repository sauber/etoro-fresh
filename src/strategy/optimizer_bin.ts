import { CachingBackend, DiskBackend } from "📚/storage/mod.ts";
import { Community } from "📚/repository/mod.ts";
import { CrossPath, CrossPathParameters } from "./cross-path.ts";
import type { DateFormat } from "../time/mod.ts";
import { diffDate } from "../time/mod.ts";
// import { avg } from "📚/chart/statistics.ts";
import { parabolic } from "📚/math/parabolic.ts";

type Position = {
  date: DateFormat;
  value: number;
};

function test(fast: number, slow: number): number {
  // console.log("Testing with fast:", fast, "slow:", slow);
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
    // console.log("Fast:", fast, "Slow:", slow);
    console.log("  Total profit:", acc.toFixed(2));
    // console.log(
    //   "  Wins:",
    //   wins,
    //   "Losses:",
    //   losses,
    //   "Winratio:",
    //   (100 * wins / (wins + losses)).toFixed(2),
    // );
    // console.log("  Average duration:", avg(duration).toFixed(2), "days");
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

  // results();
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

/** Walk one step at a time until no higher result is found in any direction */
function singlestep() {
  let fast = 1;
  let slow = 50;

  while (true) {
    const gain = test(fast, slow);

    // Decide if fast should be higher or lower
    let nextFast = fast;
    const fh = test(fast + 1, slow);
    if (fh > gain) nextFast = fast + 1;
    else {
      const fl = test(fast - 1, slow);
      if (fl > gain) nextFast = fast - 1;
    }

    // Decide if slow should be higher or lower
    let nextSlow = slow;
    const sh = test(fast, slow + 1);
    if (sh > gain) nextSlow = slow + 1;
    else {
      const sl = test(fast, slow - 1);
      if (sl > gain) nextSlow = slow - 1;
    }

    // No change to fast and slow
    console.log({ gain: +gain.toFixed(2), fast, nextFast, slow, nextSlow });
    if (nextFast == fast && nextSlow == slow) break;
    fast = nextFast;
    slow = nextSlow;
  }
}

/** Sample points in one random dimension.
 * By parabolic regression estimate peak.
 * Step towards peak.
 */
function peakscout(): void {
  // Initial values
  const params = new CrossPathParameters();
  let stepsize = [1, 1];

  while (true) {
    // In which dimension to make a step
    const p: number[] = params.names.map((name) => params[name]);
    const dimension: number = Math.floor(Math.random() * params.names.length);
    const name = params.names[dimension];
    const current = params[name];
    const { min, max } = params.boundary(name);
    const n = Array(50).fill(0).map(() => params.random(name));
    const y = n.map((x) => {
      const o = [...p];
      o[dimension] = x;
      const r: number = test(o[0], o[1]);
      return r;
    });
    // console.log(`Test values for ${name}:`, n);
    // console.log(`Test results for ${name}:`, y);
    const pairs = n.map((x, i) => [x, y[i]]);
    // console.log(pairs);
    const pb = parabolic(pairs);
    // console.log(pb);
    const yminx = pb.predict(min);
    const ymaxx = pb.predict(max);
    const candidates = [[min, yminx], [max, ymaxx]];
    if (pb.peak[0] > min && pb.peak[0] < max && Number.isFinite(pb.peak[0])) candidates.push(pb.peak);

    candidates.sort((a, b) => b[1] - a[1]);
    // console.log(candidates);

    // Step 10% towards point where peak is predicted
    const xpeak = candidates[0][0];
    stepsize[dimension] += (xpeak - current) / 2;
    stepsize[dimension] *= 0.75;
    // console.log({ name, current, xpeak, stepsize, profit: candidates[0][1] });
    console.log('result:', p, candidates[0][1], dimension, name, stepsize);
    if (Math.abs(stepsize[0]) < 0.1 && stepsize[1]<0.1) {
      break;
    }
    params.step(name, stepsize);
  }
  
}

//singlestep()
peakscout();
