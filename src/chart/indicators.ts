import { avg } from "./statistics.ts";

/** Simple Moving Average */
export function sma(data: number[], window: number): number[] {
  const offset = window - 1;
  const smaValues: number[] = new Array(data.length - offset);

  for (let i = offset; i < data.length; i++) {
    smaValues[i - offset] = avg(data.slice(i - offset, i + 1));
  }

  return smaValues;
}

/** Exponential Moving Average */
export function ema(data: number[], window: number): number[] {

  const alpha = 2 / (window + 1);
  const emaValues = new Array(data.length).fill(NaN);

  emaValues[0] = data[0];
  for (let i = 1; i < data.length; i++) {
    emaValues[i] = alpha * data[i] + (1 - alpha) * emaValues[i - 1];
  }

  return emaValues;
}
