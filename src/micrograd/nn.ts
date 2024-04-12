import { add, mul, tanh, Value } from "./engine.ts";

export class Neuron {
  public w: Value[];
  public b: Value;
  constructor(ninputs: number) {
    this.w = Array.from(
      { length: ninputs },
      () => new Value(Math.random() * (1 - -1) + -1), // Number between -1 and 1
    );
    this.b = new Value(0);
  }

  public parameters() {
    return [...this.w, this.b];
  }

  public run(inputs: Value[]) {
    return tanh(add(this.b, ...inputs.map((input, i) => mul(input, this.w[i]))));
  }
}

export class Layer {
  public neurons: Neuron[];

  constructor(ninputs: number, nneurons: number) {
    this.neurons = Array.from({ length: nneurons }, () => new Neuron(ninputs));
  }

  public parameters() {
    return this.neurons.flatMap((neuron) => neuron.parameters());
  }

  public run(inputs: Value[]) {
    return this.neurons.map((neuron) => neuron.run(inputs));
  }
}

export class MLP {
  public layers: Layer[];

  constructor(ninputs: number, noutputs: number[]) {
    const size = [ninputs, ...noutputs];
    this.layers = Array.from(
      { length: noutputs.length },
      (_, i) => new Layer(size[i], size[i + 1]),
    );
  }

  public parameters() {
    return this.layers.flatMap((layer) => layer.parameters());
  }

  public run(inputs: Value[]) {
    let outputs = inputs;
    for (const layer of this.layers) {
      outputs = layer.run(outputs);
    }
    return outputs.length === 1 ? outputs[0] : outputs;
  }
}
