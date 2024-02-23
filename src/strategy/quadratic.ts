import { PolynomialRegression } from 'npm:ml-regression-polynomial';


// const x = [50, 50, 50, 70, 70, 70, 80, 80, 80, 90, 90, 90, 100, 100, 100];
// const y = [3.3, 2.8, 2.9, 2.3, 2.6, 2.1, 2.5, 2.9, 2.4, 3.0, 3.1, 2.8, 3.3, 3.5, 3.0];
const x = [1, 2, 3, 4, 5, 6, 7, 8];
const y = [2, 5, 8, 9, 7, 4, 3, 1];
const degree = 2; // setup the maximum degree of the polynomial

const regression = new PolynomialRegression(x, y, degree);
console.log(regression.predict(80)); // Apply the model to some x value. Prints 2.6.
console.log(regression.coefficients); // Prints the coefficients in increasing order of power (from 0 to degree).
console.log(regression.toString(3)); // Prints a human-readable version of the function.
console.log(regression.score(x, y));

const coefficients = regression.coefficients;
const peakX = -coefficients[1] / (2 * coefficients[2]);
//const peakY = coefficients[0] + coefficients[1] * peakX + coefficients[2] * peakX * peakX;
const peakY = regression.predict(peakX);
console.log({peakX, peakY});
for ( let i = 1; i<=10 ; i+= 1 ) {
  console.log(i, '=>', regression.predict(i));
}