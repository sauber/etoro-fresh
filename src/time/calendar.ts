/** format of date */
// Example 2022-02-10
// TODO: Fix error: Type '"2022-02-04"' is not assignable to type '"${number}-${number}-${number}"'
//export type DateFormat = "${string}-${string}-${string}";
// export type DateFormat = string;
import type { DateFormat } from "./mod.ts";

/** Number of days from start to end date */
export function diffDate(start: DateFormat, end: DateFormat): number {
  return (new Date(end).getTime() - new Date(start).getTime()) / 86400000;
}

/** DateFormat object as string */
export function formatDate(ms: number): DateFormat {
  const date = new Date(ms);
  const yyyymmdd =
    date.getFullYear() +
    "-" +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + date.getDate()).slice(-2) as DateFormat;
  return yyyymmdd;
}

type DateCache = Record<string, Record<string, DateFormat>>;

declare global {
  var nextDateCache: DateCache;
}

// Initialize global cache
globalThis.nextDateCache = {};

// Check if a keys is missing in a dictionary
// function missing(dictionary: unknown, key: string | number): boolean {
//   return !Object.prototype.hasOwnProperty.call(dictionary, key);
// }

/** Date number of days away */
export function nextDate(date: DateFormat, days = 1): DateFormat {
  if (days == 0) return date;

  const cache = globalThis.nextDateCache;
  if (!(date in cache)) cache[date] = {};
  if (!(days in cache[date]))
    cache[date][days] = formatDate(
      new Date(date).getTime() + days * 86400000
    );

  const result: DateFormat = cache[date][days];
  return result;
}

/** Convert date to milliseconds */
export function msDate(date: DateFormat): number {
  return new Date(date).getTime();
}

// Todays date
export function today(): DateFormat {
  return formatDate(new Date().getTime());
}