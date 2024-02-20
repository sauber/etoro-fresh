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
export function rsi(data: number[], window: number): number[] {
  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 1; i < data.length; i++) {
    const difference = data[i] - data[i - 1];
    if (difference > 0) {
      gains.push(difference);
      losses.push(0);
    } else if (difference < 0) {
      gains.push(0);
      losses.push(-difference);
    } else {
      gains.push(0);
      losses.push(0);
    }
  }
  
  const averageGain: number[] = ema(gains, window);
  const averageLoss: number[] = ema(losses, window);
  console.log({gains, losses, averageGain, averageLoss});

  const rsiValues = new Array(data.length - window);

  for (let i = 0; i < averageGain.length; i++) {
    console.log(i, averageGain[i], averageLoss[i]);
    if (averageLoss[i] === 0) rsiValues[i] = 100;
    else {
      const rs = averageGain[i] / averageLoss[i];
      rsiValues[i] = 100 - 100 / (1 + rs);
    }
  }

  return rsiValues;
}
