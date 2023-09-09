/** format of date */
// Example 2022-02-10
// TODO: Fix error: Type '"2022-02-04"' is not assignable to type '"${number}-${number}-${number}"'
//export type DateFormat = "${string}-${string}-${string}";
export type DateFormat = string;

/** Number of days from start to end date */
export function diffDate(start: DateFormat, end: DateFormat): number {
  return (new Date(end).getTime() - new Date(start).getTime()) / 86400000;
}

/** DateFormat object as string */
export function formatDate(ms: number): DateFormat {
  const date = new Date(ms);
  const yyyymmdd: DateFormat =
    date.getFullYear() +
    "-" +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + date.getDate()).slice(-2);
  return yyyymmdd;
}

type DateCache = Record<string, Record<string, DateFormat>>;

declare global {
  let nextDateCache: DateCache;
  interface Window {
    nextDateCache: DateCache;
  }
}

// Initialize global cache
window.nextDateCache = {};

// Check if a keys is missing in a dictionary
function missing(dictionary: unknown, key: string | number): boolean {
  return !Object.prototype.hasOwnProperty.call(dictionary, key);
}

/** Date number of days away */
export function nextDate(date: DateFormat, days = 1): DateFormat {
  if (days == 0) return date;

  if (missing(window.nextDateCache, date)) window.nextDateCache[date] = {};
  if (missing(window.nextDateCache[date], days))
    window.nextDateCache[date][days] = formatDate(
      new Date(date).getTime() + days * 86400000
    );

  const result: DateFormat = window.nextDateCache[date][days];
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