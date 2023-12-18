import { assertInstanceOf, assertEquals } from "assert";
import { community } from "./testdata.ts";
import { Simulation, NullStrategy } from "./simulation.ts";
import { DateFormat } from "/utils/time/mod.ts";

const [start, end] = (await Promise.all([
  community.start(),
  community.end(),
])) as [DateFormat, DateFormat];

Deno.test("Instance", () => {
  const sim = new Simulation(start, end, community, NullStrategy);
  assertInstanceOf(sim, Simulation);
});

Deno.test("Run", () => {
  const sim = new Simulation(start, end, community, NullStrategy);
  sim.run();
  assertEquals(sim.gain, 0);
});
