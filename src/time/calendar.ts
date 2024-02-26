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
  const yyyymmdd = date.getFullYear() +
    "-" +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + date.getDate()).slice(-2) as DateFormat;
  return yyyymmdd;
}

type DateCache = Record<DateFormat, DateFormat>;

declare global {
  var nextDateCache: DateCache;
  var prevDateCache: DateCache;
}

// Initialize global cache
globalThis.nextDateCache = {};
globalThis.prevDateCache = {};

/** Date number of days away */
export function nextDate(date: DateFormat, days = 1): DateFormat {
  // if (days == 0) return date
  if (days == 1) {
    if (!(date in nextDateCache)) {
      nextDateCache[date] = formatDate(new Date(date).getTime() + 86400000);
    }
    return nextDateCache[date];
  } else if (days > 1) return nextDate(nextDate(date, 1), days - 1);
  else if (days == -1) {
    if (!(date in prevDateCache)) {
      prevDateCache[date] = formatDate(new Date(date).getTime() - 86400000);
    }
    return prevDateCache[date];
  } else if (days < -1) return nextDate(nextDate(date, -1), days + 1);
  else return date;
}

/** Convert date to milliseconds */
export function msDate(date: DateFormat): number {
  return new Date(date).getTime();
}

// Todays date
export function today(): DateFormat {
  return formatDate(new Date().getTime());
}

/** A range of dates including start and end dates */
export function range(start: DateFormat, end: DateFormat): Array<DateFormat> {
  const dates = [];
  while (start <= end) {
    dates.push(start);
    start = nextDate(start, 1);
  }
  return dates;
}
