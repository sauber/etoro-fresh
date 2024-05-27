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
    for (const p of this.network.parameters()) {
      p.data -= learning_rate * p.grad;
    }

    console.log("Iteration", n, "loss", loss.data);
  }

  public run(iterations: number, rate: number = 0.1): void {
    for (let i = 0; i < iterations; i++) {
      this.step(i, rate);
    }
  }
}
