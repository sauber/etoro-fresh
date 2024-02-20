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

/** Relative Strength Index */
export function rsi(data: number[], windowSize: number): number[] {
  if (data.length < 5) {
    throw new Error("Data length must be at least 5 for an RSI window of 5");
  }

  const gains: number[] = new Array(data.length - 1).fill(0);
  const losses: number[] = new Array(data.length - 1).fill(0);

  for (let i = 1; i < data.length; i++) {
    const difference: number = data[i] - data[i - 1];
    gains[i - 1] = Math.max(0, difference);
    losses[i - 1] = Math.max(0, -difference);
  }

  // console.log({ gains, losses });

  let averageGain = avg(gains.slice(0, windowSize));
  let averageLoss = avg(losses.slice(0, windowSize));

  // console.log({ averageGain, averageLoss });

  const rsiValues = new Array<number>(data.length - windowSize);

  if (averageLoss == 0) rsiValues[0] = 100;
  else {
    const rs = averageGain / averageLoss;
    rsiValues[0] = 100 - 100 / (1 + rs);
  }

  // console.log({ gains, losses });

  for (let i = windowSize; i < data.length -1; i++) {
    // averageGain = (averageGain * (windowSize - 1) + gains[i]) / windowSize;
    // averageLoss = (averageLoss * (windowSize - 1) + losses[i]) / windowSize;
    averageGain = (averageGain * (windowSize - 1) + gains[i]) / windowSize;
    averageLoss = (averageLoss * (windowSize - 1) + losses[i]) / windowSize;
    // console.log({ i, averageGain, averageLoss, gains: gains[i], losses: losses[i] });
    if (averageLoss == 0) rsiValues[i - windowSize + 1] = 100;
    else {
      const rs = averageGain / averageLoss;
      rsiValues[i - windowSize + 1] = 100 - 100 / (1 + rs);
    }
  }

  return rsiValues;
}
