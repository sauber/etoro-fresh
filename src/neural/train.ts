import { plot } from "chart";
import { printImage } from "terminal_images";
import { sum, Value } from "./value.ts";
import { Network } from "./network.ts";

export type Inputs = number[][];
export type Outputs = number[][];
export type Values = Value[][];

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from https://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hueToRgb(p, q, h + 1/3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1/3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function hueToRgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1/6) return p + (q - p) * 6 * t;
  if (t < 1/2) return q;
  if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
  return p;
}


/** Train a neural network */
export class Train {
  private readonly lossHistory: number[] = [];
  private readonly xs: Values;
  private readonly ys: Values;
  
  // Stop when loss is lower than epsilon
  public epsilon = 0.0001;

  // Noumber of samples per step
  public batchSize = 23;

  constructor(
    private readonly network: Network,
    input: Inputs,
    output: Outputs,
  ) {
    this.xs = input.map((row) => row.map((v) => new Value(v)));
    this.ys = output.map((row) => row.map((v) => new Value(v)));
  }

  private static MeanSquareError(a: Values, b: Values): Value {
    const squares: Value[] = a.map((line: Value[], row: number) =>
      line.map(
        (val: Value, col: number) => val.sub(b[row][col]).pow(2),
      )
    ).flat();
    const count: Value = new Value(a.length);
    const mean: Value = sum(...squares).div(count);
    return mean;
  }

  /** Pick random samples for training */
  private batch(): [Values, Values] {
    const xs: Values = [];
    const ys: Values = [];
    const l = this.xs.length;
    for ( let n = 0; n < this.batchSize ; ++n) {
      const i = Math.floor(Math.random() * l);
      xs.push(this.xs[i]);
      ys.push(this.ys[i]);
    }
    return [xs, ys];
  }

  /** Run training on a batch */
  private step(n: number, learning_rate: number): void {
    const [xs, ys] = this.batch();

    // Forward
    const predict: Values = xs.map((line: Value[]) =>
      this.network.forward(line)
    );
    // this.network.print();
    const loss = Train.MeanSquareError(ys, predict);
    // console.log('Iteration', n, 'loss', loss.data);
    if (isNaN(loss.data) || loss.data > 1000000) {
      loss.print();
      throw new Error("Loss inclined to infinity");
    }
    this.lossHistory.push(loss.data);

    // Backward
    this.network.zeroGrad();
    loss.backward();

    // Update
    // Stochastic Gradient Descent
    for (const p of this.network.parameters()) {
      p.data -= learning_rate * p.grad;
      if (!isFinite(p.data) || Math.abs(p.data) > 1000000) {
        // loss.print();
        p.print();
        console.log({ learning_rate, grad: p.grad });
        throw new Error("Data is Infinity");
      }
    }
  }

  public run(iterations: number, rate: number = 0.1): void {
    // const eta = new ProgressBar('Training', iterations);
    let i = 0;
    for (; i < iterations; i++) {
      this.step(i, rate);
      const l = this.lossHistory.length;
      // Stop when loss is small enough
      if (this.lossHistory[this.lossHistory.length - 1] < this.epsilon) break;
      // Stop when loss is unchanged
      if (l >= 2 && this.lossHistory[l - 1] == this.lossHistory[l - 2]) break;
      // eta.sync_update(i);
    }
    // eta.finish();
    console.log("Iterations: ", i);
  }

  // Resample data to 80 columns and display ascii chart
  private plot_graph(data: number[], height: number): string {
    const step = (data.length-1) / 80;
    const samples: number[] = [];
    for (let i = 1; i < data.length; i += step) {
      samples.push(data[Math.floor(i)]);
    }
    // console.log({ samples });
    return plot(samples, { height });
  }

  /** Plot loss history */
  public loss_chart(height = 16): string {
    return this.plot_graph(this.lossHistory, height);
  }

  public async scatter_chart(
    xrange: [number, number],
    yrange: [number, number],
    pad: number[],
    lines = 16,
  ): Promise<void> {
    // To keep visible aspect there are twice as many rows as lines
    const rows = lines * 2;

    // Each half width chart is 2x2 grid
    const subsize = rows * 2;

    // For inputs beyond first 2 set values to 0
    // const inputs: number = this.network.inputs;
    // const pad: 0[] = new Array(inputs - 2).fill(0);

    // Scale grid to input values
    const xstart = xrange[0];
    const xscale = (xrange[1] - xrange[0]) / (subsize - 1);
    const ystart = yrange[0];
    const yscale = (yrange[1] - yrange[0]) / (subsize - 1);

    const yp: number[] = [];
    for (let y = subsize-1; y >=0; --y) {
      for (let x = 0; x < subsize; ++x) {
        const input = [xstart + x * xscale, ystart + y * yscale, ...pad];
        const p: number[] = this.network.predict(input);
        yp.push(p[0]);
        // console.log('scatter', input, p);
        // const c = Math.floor(p[0] * 256);
        // pixbuffer.push(c, c, c, 255);
      }
    }
    console.log("number of outputs in scatter plot:", yp.length);
    const ymin: number = Math.min(...yp, ...this.ys.map(y=>y[0].data));
    const ymax: number = Math.max(...yp, ...this.ys.map(y=>y[0].data));
    const cs: number[] = yp.map((v: number) =>
      Math.floor((v - ymin) / (ymax - ymin) * 255)
    );
    // console.log({ys, cs});

    const pixbuffer: Array<number> = [];
    cs.forEach((c: number) => pixbuffer.push(c, c, c, 255));

    // Overlay training data
    this.xs.forEach((input: Value[], index: number) => {
      const x: number = input[0].data;
      const y: number = input[1].data;
      const xg: number = Math.floor((x - xstart) / xscale);
      // const yg: number = Math.floor((y - ystart) / yscale);
      const yg: number = Math.floor(Math.floor((y - ystart) / yscale)/2)*2;
      const v = this.ys[index][0].data;
      // const c = Math.floor((v - ymin) / (ymax - ymin) * 255);
      const pixindex: number = ((subsize-yg-1) * subsize + xg) * 4;
      // Lightness in range 0.1:0.9
      const lightness = ((v - ymin) / (ymax - ymin)) * 0.8 + 0.1;
      const degree = v > 0 ? 1/3 : 0; // 120=green, 0=red
      const [r, g, b] = hslToRgb(degree, 1, lightness);
      // console.log('overlay', {x, y, v, xg, yg, lightness, pixindex});
      pixbuffer[pixindex] = r;
      pixbuffer[pixindex+1] = g;
      pixbuffer[pixindex+2] = b;
      
    });

    const imageBuffer: Uint8Array = new Uint8Array(pixbuffer);

    console.log("scatter", { xrange, yrange, pad, lines, subsize });
    await printImage({
      rawPixels: { width: subsize, height: subsize, data: imageBuffer },
      width: rows,
    });
  }
}
