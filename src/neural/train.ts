import { plot } from "https://deno.land/x/chart/mod.ts";

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
  public readonly beta = 0.9;
  public velocityHistory = [0];

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
    // loss.print();
    this.lossHistory.push(loss.data);

    // Stochastic Gradient Descent
    this.network.zeroGrad();
    loss.backward();
    // loss.print();

    // Update

    // Stochastic Gradient Descent
    // velocity = 1;
    // Gradient Descent with Momentum
    const prev = this.velocityHistory[this.velocityHistory.length-1];
    const velocity = this.beta * prev + ( 1 - this.beta) * loss.data;
    this.velocityHistory.push(velocity);
    // console.log('velocity', this.velocity);

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
  private plot_graph(name: string, data: number[]): void {
    const step = data.length / 80;
    const samples: number[] = [];
    for (let i = 0; i < data.length; i += step) {
      samples.push(data[Math.floor(i)]);
    }
    console.log(name);
    console.log(plot(samples, { height: 16 }));
  }

  /** Plot loss history */
  public print_loss(): void {
    this.plot_graph('Loss History', this.lossHistory);
  }

  public print_velocity(): void {
    this.plot_graph('Velocity History', this.velocityHistory);
  }

}
