import { Network } from "./network.ts";

// Visualize training results

/** Middle of sorted values */
function mean(n: number[]): number {
  const sorted = n.slice().sort();
  const middle = Math.floor(sorted.length / 2);
  return sorted[middle];
}

/** Extract column from grid */
function column(grid: DataSet, index: number): number[] {
  return grid.map((row) => row[index]);
}

/** Min and max number in array */
function MinMax(array: number[]): [number, number] {
  return [Math.min(...array), Math.max(...array)];
}

/** Convert number in input range to number in output range */
function scale(
  input_min: number,
  input_max: number,
  output_min: number,
  output_max: number,
  input: number,
): number {
  return (input - input_min) / (input_max - input_min) *
      (output_max - output_min) + output_min;
}

type DataSet = number[][];
type Color = [number, number, number, number]; // R, G, B, A

/** A quadratic canvas in range xmin:xmax, ymin:ymax */
class PixelCanvas {
  public readonly buffer: Uint8Array;

  constructor(
    private readonly xmin: number,
    private readonly xmax: number,
    private readonly ymin: number,
    private readonly ymax: number,
    private readonly size: number,
  ) {
    this.buffer = new Uint8Array(Array(size * size * 4).fill(0));
  }

  /** Convert floating (x,y) position to buffer index */
  // TODO: Odd lines are ignored in terminal output
  private pos(x: number, y: number): number {
    const xg: number = Math.round(
      scale(this.xmin, this.xmax, 0, this.size - 1, x),
    );
    const yg: number = Math.round(
      scale(this.ymin, this.ymax, 0, this.size - 1, y),
    );
    return ((this.size - yg - 1) * this.size + xg) * 4;
  }

  /** Set value at position */
  public set(x: number, y: number, color: Color): void {
    const offset = this.pos(x, y);
    // console.log({ buffer: this.buffer, x, y, offset, color });
    this.buffer.set(color, offset);
  }
}

export class ScatterPlot {
  /**
   * @param   {Network}  network  Neural network
   * @param   {DataSet}  xs       Training input values
   * @param   {DataSet}  ys       Training output values
   */
  constructor(
    private readonly network: Network,
    private readonly xs: DataSet,
    private readonly ys: DataSet,
  ) {
  }

  /**
   * Create a pixbuffer of the plot
   *
   * @param   {number}      size  Number of rows and columns
   * @param   {number}      xcol  Input column number for x-axis
   * @param   {number}      ycol  Input column number for y-axis
   * @param   {number}      vcol  Output column number for values
   * @return  {Uint8Array}        8-bit RGBT buffer
   */
  public pixels(size = 16, xcol = 0, ycol = 1, vcol = 0): Uint8Array {
    // Identify data columns
    const xs: number[] = column(this.xs, xcol);
    const ys: number[] = column(this.xs, ycol);
    const vs: number[] = column(this.ys, vcol);

    // Identify minimum and maximum in each column
    const xmin: number = Math.min(...xs);
    const xmax: number = Math.max(...xs);
    const ymin: number = Math.min(...ys);
    const ymax: number = Math.max(...ys);
    const vmin: number = Math.min(...vs);
    const vmax: number = Math.max(...vs);

    // Identify mean value in all input columns
    // TODO: Skip columns used in grid
    const means: number[] = this.xs[0].map((_, i) => mean(column(this.xs, i)));

    // Create list of predicted values at each grid position
    const values: Array<[number, number, number]> = [];
    const xstep: number = (xmax - xmin) / (size - 1);
    const ystep: number = (xmax - xmin) / (size - 1);
    for (let x = xmin; x <= xmax; x += xstep) {
      for (let y = ymin; y <= ymax; y += ystep) {
        const input: number[] = [...means];
        input[xcol] = x;
        input[ycol] = y;
        const output = this.network.predict(input);
        const value = output[vcol];
        values.push([x, y, value]);
      }
    }

    // Plot predicted values
    const canvas = new PixelCanvas(xmin, xmax, ymin, ymax, size);
    let [pmin, pmax] = MinMax(column(values, 2));
    if (vmin < pmin) pmin = vmin;
    if (vmax > pmax) pmax = vmax;
    values.forEach(([x, y, p]) => {
      const lightness: number = Math.floor(scale(pmin, pmax, 0, 255, p));
      const color: Color = [255 - lightness, 128, 128, 255];
      canvas.set(x, y, color);
    });

    // Overlay training set
    this.xs.forEach((input, index) => {
      const [x, y] = [input[xcol], input[ycol]];
      const v: number = this.ys[index][vcol];
      const lightness = Math.floor(scale(pmin, pmax, 0, 255, v));
      const color: Color = (lightness >= 128)
        ? [0, lightness, 0, 255] // green
        : [lightness + 64, 0, 0, 255]; // red
      canvas.set(x, y, color);
    });

    return canvas.buffer;
  }
}
