import { plot } from "chart";
import { printImage } from "terminal_images";
import { sum, Value } from "./value.ts";
import { Network } from "./network.ts";

export type Inputs = number[][];
export type Outputs = number[][];
export type Values = Value[][];

/** Train a neural network */
export class Train {
  private readonly lossHistory: number[] = [];
  private readonly xs: Values;
  private readonly ys: Values;
  public epsilon = 0.0001;

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

  private step(n: number, learning_rate: number): void {
    const predict: Values = this.xs.map((line: Value[]) =>
      this.network.forward(line)
    );
    const loss = Train.MeanSquareError(this.ys, predict);
    this.lossHistory.push(loss.data);

    // Stochastic Gradient Descent
    this.network.zeroGrad();
    loss.backward();

    // Update
    // Stochastic Gradient Descent
    for (const p of this.network.parameters()) {
      p.data -= learning_rate * p.grad;
    }

    // console.log("Iteration", n, "loss", loss.data);
  }

  public run(iterations: number, rate: number = 0.1): void {
    let i = 0;
    for (; i < iterations; i++) {
      this.step(i, rate);
      // Step when loss is small enough
      if (this.lossHistory[this.lossHistory.length - 1] < this.epsilon) break;
    }
    console.log("Iterations: ", i);
  }

  // Resample data to 80 columns and display ascii chart
  private plot_graph(data: number[], height: number): string {
    const step = data.length / 80;
    const samples: number[] = [];
    for (let i = 0; i < data.length; i += step) {
      samples.push(data[Math.floor(i)]);
    }
    return plot(samples, { height });
  }

  /** Plot loss history */
  public loss_chart(height = 16): string {
    return this.plot_graph(this.lossHistory, height);
  }

  public async scatter_chart(height = 16): Promise<void> {
    const subsize = height * 4;

    const pixbuffer: Array<number> = [];
    for (let x = 0; x < subsize; ++x) {
      for (let y = 0; y < subsize; ++y) {
        const p = this.network.forward([
          new Value(x / (subsize - 1)),
          new Value(y / (subsize - 1)),
        ]);
        const c = Math.floor(p[0].data * 256);
        pixbuffer.push(c, c, c, 255);
      }
    }

    const imageBuffer: Uint8Array = new Uint8Array(pixbuffer);

    await printImage({
      rawPixels: { width: subsize, height: subsize, data: imageBuffer },
      width: height * 2,
    });
  }
}
