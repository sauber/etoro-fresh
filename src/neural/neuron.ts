import { sum, Value } from "./value.ts";
import { Node } from "./node.ts";

export type NeuronData = {
  bias: number;
  weights: Array<number>;
};

export class Neuron extends Node {
  private static randomValue(): Value {
    return new Value(Math.random() * 2 - 1, {op: "🔀"});
  }

  constructor(
    public readonly inputs: number,
    private readonly bias: Value = Neuron.randomValue(),
    private readonly weights: Array<Value> = Array.from(
      Array(inputs),
      (_) => Neuron.randomValue(),
    ),
  ) {
    super();
  }

  /** Re-initialize a pre-trained neuron */
  public static import(data: NeuronData): Neuron {
    const bias = new Value(data.bias);
    const weights = data.weights.map((v) => new Value(v));
    return new Neuron(weights.length, bias, weights);
  }

  /** Export bias and weights */
  public get export(): NeuronData {
    return {
      bias: this.bias.data,
      weights: this.weights.map((v: Value) => v.data),
    };
  }

  /** Calculate w·x + b */
  public forward(inputs: Value[]): Value {
    if (inputs.length != this.weights.length) {
      throw new Error(
        `Wrong number of input. Got ${inputs.length}, Expected ${this.weights.length}.`,
      );
    }
    return sum(
      ...inputs.map((input: Value, index: number) =>
        input.mul(this.weights[index])
      ),
      this.bias,
    );
  }

  public get parameters(): Value[] {
    return [...this.weights, this.bias];
  }
}
