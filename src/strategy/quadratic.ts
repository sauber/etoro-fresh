import { assertEquals } from "$std/assert/mod.ts";
import { PolynomialRegression } from "npm:ml-regression-polynomial";
import regression from "npm:regression";

/** Perform quadratic polynomial regression and predict peak */
export function peak(x: number[], y: number[]): { x: number; y: number } {
  const regression = new PolynomialRegression(x, y, 2);
  const coefficients = regression.coefficients;
  const peakX = -coefficients[1] / (2 * coefficients[2]);
  const peakY = regression.predict(peakX);
  return { x: peakX, y: peakY };
}

/** 
 * Perform quadratic polynomial regression and predict peak.
 * Find max y at
 * Ref: https://tom-alexander.github.io/regression-js/
 *   */
export function rpeak(x: number[], y: number[]): { x: number; y: number } {
  const data = x.map((x, i) => [x, y[i]]);

  // var data = [[0,1],[32, 67] .... [12, 79]];
  const pr = regression.polynomial(data, { order: 2, precision: 8 });
  const coefficients: [number, number, number] = pr.equation;
  const peakX: number = -coefficients[1] / (2 * coefficients[0]);
  const peakY: number = pr.predict(peakX)[1];
  //console.log({peakX, peakY});
  return { x: peakX, y: peakY };
}

// Deno.test("Polynomial Regression", () => {
//   const x = [0, 32, 12];
//   const y = [1, 67, 79];
//   const peak = rpeak(x, y);
//   assertEquals(peak, 0);
// })