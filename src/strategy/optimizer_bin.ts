import { CachingBackend, DiskBackend } from "📚/storage/mod.ts";
import { Community } from "📚/repository/mod.ts";
import type { DateFormat } from "📚/time/mod.ts";
import { diffDate } from "📚/time/mod.ts";
import { parabolic } from "📚/math/parabolic.ts";
import { Chart } from "📚/chart/mod.ts";
import { CrossPath, CrossPathParameters } from "./cross-path.ts";
import { MACD, MACDParameters } from "./macd.ts";
import type { Parameter } from "./cross-path.ts";

type Position = {
  date: DateFormat;
  value: number;
};

type Point = [number, number];

function shuffle<T>(array: T[]): T[] {
  return [...array].sort((_a, _b) => Math.random()-0.5)
}

function sample<T>(array: T[], count: number): T[] {
  const shuffled = shuffle(array);
  return shuffled.slice(0, count);
}

/** Aquire the result of parameters */
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

  /** Loop all dates in random sample charts */
  const c: Chart[] = sample(charts, 20);
  c.forEach((chart, _index) => {
    let position: Position | null = null;
    // const strategy = new CrossPath(chart, fast, slow);
    const strategy = new MACD(chart, fast, slow);
    const dates: DateFormat[] = strategy.dates;
    dates.forEach((date: DateFormat) => {
      const signal: number = strategy.value(date);
      if (signal > 0 && !position) {
        // Have no position, so open one
        position = { date: date, value: 1000 * signal };
      } else if (signal < 0 && position) {
        // Close existing position, lose 2% on trade
        const profit = position.value *
          (chart.gain(position.date, date) - 0.01);
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

/** The sample with highe result */
function absolutePeak(samples: Point[]): Point {
  samples.sort((a,b) => b[1]-a[1]);
  return samples[0];
}

/** Parabalic regression on samples to find peak */
function parabolicPeak(samples: Point[]): Point {
  const x: number[] = samples.map((s) => s[0]);
  const minx: number = Math.min(...x);
  const maxx: number = Math.max(...x);

  const pb = parabolic(samples);

  // Confirm regression concluded
  pb.coefficients.forEach((c) => {
    if (!Number.isFinite(c)) {
      throw new Error("Invalid regression coefficients:" + pb.coefficients);
    }
  });

  // Get values at min and max
  const yminx: number = pb.predict(minx);
  const ymaxx: number = pb.predict(maxx);
  const candidates: Point[] = [[minx, yminx], [maxx, ymaxx]];

  // Confirm peak is between min and max
  if (pb.peak[0] > minx && pb.peak[0] < maxx) candidates.push(pb.peak);

  // Find highest point
  candidates.sort((a, b) => b[1] - a[1]);
  const peak = candidates[0];
  return peak;
}

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
  const params = new MACDParameters();
  let velocity = [0, 0];
  const friction = 0.75;
  const sample = 10;

  while (true) {
    // Current point
    const current: number[] = params.names.map((n) => params[n]);

    // Pick random dimension
    const i: number = Math.floor(Math.random() * params.names.length);

    // Name of Ith dimention
    const name = params.names[i] as Parameter;

    // Friction
    velocity = velocity.map((v) => v * friction);

    // Min and max are same, so cannot estimate new peak position
    const { min, max } = params.boundary(name);
    if (min == max) continue;

    // Take uniq samples at min, max and other random points
    const n = Array(sample).fill(0).map(() => params.random(name));
    n.push(min, max);
    const s = [...new Set(n)].sort((a, b) => a - b);
    const pairs = s.map((x) => {
      const point = [...current];
      point[i] = x;
      const y: number = test(point[0], point[1]);
      return [x, y];
    });

    // Parabolic regression to find peak
    // const peak = parabolicPeak(pairs);
    const peak = absolutePeak(pairs);

    // Is peak higher than current
    // const y = test(current[0], current[1]);
    // if (peak[1] < y) continue;

    // Increase velocity towards peak
    velocity[i] += (peak[0] - current[i]) * 0.1;

    // Take step towards peak. Evaluate actual step taken.
    // const stepsize = velocity[i];
    // const actualStep = params.step(name, stepsize);
    velocity.forEach((v, i) => params.step(params.names[i] as Parameter, v));

    // Display action
    const profit = test(params[params.names[0]], params[params.names[1]]);
    console.log(current, name, peak, velocity, profit);

    // Continue if velocity is high enough
    if (Math.abs(velocity[0]) < 0.1 && Math.abs(velocity[1]) < 0.1) break;
  }
}

/** Test all possible parameters */
function sweep(): void {
  const params = new CrossPathParameters();
  const [min, max] = [2, 199];
  for (let fast = min; fast <= max; fast++) {
    params.fast = fast;
    const { min, max } = params.boundary("slow");
    for (let slow = min; slow <= max; slow++) {
      const result = test(fast, slow);
      console.log(fast, slow, result);
    }
  }
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

//singlestep()
peakscout();
// sweep();
