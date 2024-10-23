import { Network, Train } from "@sauber/neurons";
import type { NetworkData } from "@sauber/neurons";
import type { Input, Output, Inputs, Outputs } from "./mod.ts";

export class Model {
  constructor(private readonly network: Network) {}

  public static generate(inputs: number) {
    const hidden: number = Math.round(inputs * 1.5);
    const network = new Network(inputs).normalize.dense(hidden).lrelu.dense(
      hidden,
    ).lrelu.dense(1);
    return new Model(network);
  }

  public static import(data: NetworkData) {
    const network = Network.import(data);
    return new Model(network);
  }

  public export(): NetworkData {
    return this.network.export;
  }

  public train(
    inputs: Inputs,
    outputs: Outputs,
    max_iterations: number = 20000,
    learning_rate: number = 0.001,
  ): number {
    this.network.adapt(inputs);
    const train = new Train(this.network, inputs, outputs);
    const iterations: number = train.run(max_iterations, learning_rate);
    return iterations;
  }

  public predict(input: Input): Output {
    return this.network.predict(input) as Output;
  }
}
