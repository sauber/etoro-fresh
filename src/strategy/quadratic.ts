import { PolynomialRegression } from "npm:ml-regression-polynomial";

/** Perform quadratic polynomial regression and predict peak */
export function peak(x: number[], y: number[]): { x: number; y: number } {
  const regression = new PolynomialRegression(x, y, 2);
  const coefficients = regression.coefficients;
  const peakX = -coefficients[1] / (2 * coefficients[2]);
  const peakY = regression.predict(peakX);
  return { x: peakX, y: peakY };
}
