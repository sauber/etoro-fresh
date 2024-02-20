export function sma(data: number[], window: number): number[] {
  const smaValues = new Array(data.length - window + 1);

  for (let i = window - 1; i < data.length; i++) {
    smaValues[i - window + 1] =
      data.slice(i - window + 1, i + 1).reduce((sum, value) => sum + value, 0) /
      window;
  }

  return smaValues;
}
