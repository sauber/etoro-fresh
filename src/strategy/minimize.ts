export function minimize(
  f: (x: number, y: number) => number,
  x0: number,
  y0: number,
  alpha: number = 0.1,
  beta: number = 0.5,
  maxSteps: number = 1000,
  epsilon: number = 1e-6
): { x: number; y: number } {
  let x = x0;
  let y = y0;
  let dx = 0;
  let dy = 0;
  let fx = f(x, y);
  let fxPrev = fx;

  for (let i = 0; i < maxSteps; i++) {
    // Forward difference estimation of derivatives
    let fxPlusX = f(x + epsilon, y);
    dx = (fxPlusX - fx) / epsilon;
    let fxPlusY = f(x, y + epsilon);
    dy = (fxPlusY - fx) / epsilon;

    // Adaptive step size based on previous improvement
    let stepSize = alpha * Math.max(Math.abs(fxPrev - fx), epsilon);

    // Update positions
    x -= stepSize * dx;
    y -= stepSize * dy;

    // Update function value
    fxPrev = fx;
    fx = f(x, y);
    console.log({x, y, stepSize, fx});

    // Convergence check
    if (Math.abs(fxPrev - fx) < epsilon) {
      break;
    }
  }

  return { x, y };
}

// const result = minimize(
//   (x: number, y: number) => x * x + y * y,
//   4,
//   3,
//   0.1, // alpha
//   0.5, // beta
//   1000, // maxSteps
//   1e-6 // epsilon
// );

// console.log(`Minimum found at: x=${result.x}, y=${result.y}`);
