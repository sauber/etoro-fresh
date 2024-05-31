import { sum, Value } from "./value.ts";

class Module {
  public zeroGrad() {
    for (const p of this.parameters()) p.grad = 0;
  }
  public parameters(): Value[] {
    return [];
  }
}
export class Neuron extends Module {
  private weights: Value[] = [];
  private bias: Value;

  static random(label: string): Value {
    return new Value(Math.random() * 2 - 1, { label: label });
  }

  constructor(nin: number) {
    super();
    for (let i = 0; i < nin; i++) {
      const wi = Neuron.random("w" + i);
      this.weights.push(wi);
    }
    this.bias = Neuron.random("bias");
  }

  // w * x + b
  public forward(x: Value[]): Value {
    if (x.length != this.weights.length) {
      throw new Error(
        `Wrong number of input. Got ${x.length}, Expected ${this.weights.length}`,
      );
    }
    return sum(
      ...x.map((xi, i) => xi.mul(this.weights[i])),
      this.bias,
    );
  }

  public parameters(): Value[] {
    return [...this.weights, this.bias];
  }

  public print(indent = ""): void {
    console.log(indent + "Neuron");
    console.log(indent + " Weights:");
    this.weights.forEach((n) => n.print(indent + "  "));
    console.log(indent + " Bias:");
    this.bias.print(indent + "  ");
  }
}

/** All nodes in input layer connected to all nodes in output layer */
export class Dense extends Module {
  private readonly neurons: Neuron[] = [];

  constructor(nin: number, nout: number) {
    super();
    for (let i = 0; i < nout; i++) this.neurons.push(new Neuron(nin));
  }

  public forward(x: Value[]): Value[] {
    const outs: Value[] = [];
    for (const neuron of this.neurons) outs.push(neuron.forward(x));
    return outs;
  }

  public parameters(): Value[] {
    const params: Value[] = [];
    for (const neuron of this.neurons) params.push(...neuron.parameters());
    return params;
  }

  public print(indent = ""): void {
    console.log(indent + "Dense Layer");
    this.neurons.forEach((n) => n.print(indent + " "));
  }
}

/** A layer of Relu activations */
export class Relu extends Module {
  private readonly values: Value[] = [];

  public forward(x: Value[]): Value[] {
    return x.map((n) => n.relu());
  }

  public print(indent = ""): void {
    console.log(indent + "Relu Layer");
  }
}

/** A layer of Relu activations */
export class LRelu extends Module {
  private readonly values: Value[] = [];

  public forward(x: Value[]): Value[] {
    return x.map((n) => n.lrelu());
  }

  public print(indent = ""): void {
    console.log(indent + "Leaky Relu Layer");
  }
}


/** A layer of Sigmoid activations */
export class Sigmoid extends Module {
  private readonly values: Value[] = [];

  public forward(x: Value[]): Value[] {
    return x.map((n) => n.sigmoid());
  }

  public print(indent = ""): void {
    console.log(indent + "Sigmoid Layer");
  }
}

/** A layer of tanh() activations */
export class Tanh extends Module {
  private readonly values: Value[] = [];

  public forward(x: Value[]): Value[] {
    return x.map((n) => n.tanh());
  }

  public print(indent = ""): void {
    console.log(indent + "Tanh Layer");
  }
}

/** A layer of binary activations */
export class Binary extends Module {
  private readonly values: Value[] = [];

  public forward(x: Value[]): Value[] {
    return x.map((n) => n.bin());
  }

  public print(indent = ""): void {
    console.log(indent + "Binary Layer");
  }
}

/** An array of layers */
export class Network extends Module {
  constructor(private readonly layers: Array<Dense | Relu | LRelu | Sigmoid | Tanh | Binary>) {
    super();
  }

  public forward(xin: Value[]): Value[] {
    let xout = [...xin];
    for (const layer of this.layers) xout = layer.forward(xout);
    return xout;
  }

  public parameters(): Value[] {
    const params: Value[] = [];
    for (const layer of this.layers) params.push(...layer.parameters());
    return params;
  }

  public print(indent = ""): void {
    console.log(indent + "Network");
    this.layers.forEach((l) => l.print(indent + " "));
  }
}

/** Multi Level Perceptron */
// export class MLP extends Module {
//   layers: Dense[] = [];

//   constructor(nin: number, nouts: number[]) {
//     super();
//     const sz = [nin, ...nouts];
//     for (let i = 0; i < nouts.length; i++) {
//       this.layers.push(new Dense(sz[i], sz[i + 1]));
//     }
//   }

//   forward(xin: Value[]): Value[] {
//     let xout = [...xin];
//     for (const layer of this.layers) xout = layer.forward(xout);
//     return xout;
//   }

//   parameters(): Value[] {
//     const params: Value[] = [];
//     for (const layer of this.layers) params.push(...layer.parameters());
//     return params;
//   }
// }
