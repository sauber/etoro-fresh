import { Community } from "📚/repository/mod.ts";
import { DiskBackend, CachingBackend } from "📚/storage/mod.ts";
import type { DateFormat } from "/utils/time/mod.ts";
import { nextDate } from "📚/utils/time/calendar.ts";
import { Simulation } from "📚/simulation/simulation.ts";
import { RandomStrategy } from "../strategy/strategy.ts";

// Community Repo
const path: string = Deno.args[0];
const backend = new DiskBackend(path);
const repo = new CachingBackend(backend);
export const community = new Community(repo);

// Start and end dates
const [start, end] = (await Promise.all([
  community.start(),
  community.end(),
])) as [DateFormat, DateFormat];

const stop = nextDate(end);
const sim = new Simulation(start, "2022-04-27", community, RandomStrategy);
await sim.run();
sim.book.export.digits(2).print("Random Strategy");