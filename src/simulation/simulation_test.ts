import { assertInstanceOf, assertEquals } from "assert";
import { community } from "./testdata.ts";
import { Simulation, NullStrategy } from "./simulation.ts";
import { DateFormat, diffDate } from "/utils/time/mod.ts";

const [start, end] = (await Promise.all([
  community.start(),
  community.end(),
])) as [DateFormat, DateFormat];

Deno.test("Instance", () => {
  const sim = new Simulation(start, end, community, NullStrategy);
  assertInstanceOf(sim, Simulation);
});

Deno.test("Run", async () => {
  const sim = new Simulation(start, end, community, NullStrategy);
  await sim.run();
  const chart = sim.chart;
  const days = 1 + diffDate(start, end);
  assertEquals(chart.gain(start, end), 0);
  assertEquals(chart.length, days);
});
