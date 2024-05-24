import { add, mul, tanh, relu, Value } from "./engine.ts";

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
    // return relu(add(this.b, ...inputs.map((input, i) => mul(input, this.w[i]))));
    // return add(this.b, ...inputs.map((input, i) => mul(input, this.w[i])));
  }

  public print(indent = ""): void {
    console.log(indent + "Neuron");
    console.log(indent + " Weights");
    for ( const w of this.w) { w.print(indent + "  ")}
    console.log(indent + " B");
    this.b.print(indent + "  ");
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
  
  public print(indent = ""): void {
    console.log(indent + "Layer");
    for ( const n of this.neurons) { n.print(indent + " ")}
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
  
  public print(indent = ""): void {
    console.log(indent + "MLP");
    for ( const l of this.layers) { l.print(indent + " ")}
  }
}
