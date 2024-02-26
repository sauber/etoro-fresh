import { community } from "📚/repository/testdata.ts";
export { community } from "📚/repository/testdata.ts";
import { Position } from "./position.ts";

// Random investor
export const investor = await community.any();

// Position data
const amount = 1000;
const open = investor.chart.start;
export const position = new Position(investor, open, amount);
