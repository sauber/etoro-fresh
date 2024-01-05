import { Simulation } from "📚/simulation/simulation.ts";
import { RandomStrategy } from "📚/simulation/strategy.ts";
import { Community } from "📚/investor/mod.ts";
import { RepoDiskBackend } from "📚/repository/mod.ts";
import type { DateFormat } from "/utils/time/mod.ts";
import { nextDate } from "📚/utils/time/calendar.ts";

// Community Repo
const path: string = Deno.args[0];
const backend = new RepoDiskBackend(path);
export const community = new Community(backend);

// Start and end dates
const [start, end] = (await Promise.all([
  community.start(),
  community.end(),
])) as [DateFormat, DateFormat];

const stop = nextDate(end);
const sim = new Simulation(start, stop, community, RandomStrategy);
await sim.run();
