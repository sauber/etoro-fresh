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

// Scale input to range of -1:1
export class Scaler extends Module {
  private min = 0;
  private max = 0;
  private a = 0;
  private b = 0;

  public forward(v: Value): Value {
    // Extend range
    if (v.data > this.max) {
      this.max = v.data;
      this.b = 1;
    }
    if (v.data < this.min) {
      this.min = v.data;
      this.a = -1;
    }

    // [0:0] range and 0 input value
    if (this.min == 0 && this.max == 0) return v;

    // Scale input value to a:b
    const scaled =
      (this.b - this.a) * (v.data - this.min) / (this.max - this.min) + this.a;
    if ( scaled < -1 || scaled > 1 ) {
      console.log('scaling', {min: this.min, max: this.max, a: this.a, b: this.b, input: v.data, output: scaled});
      throw new Error('Scaling out of range');
    }
    return new Value(scaled, { prev: [v], op: `[${this.min}:${this.max}]` });
  }

  // No adjustments in back propagation
  // XXX: Move adjustments from forward to backward
  public parameters(): Value[] {
    return [];
  }

  public print(indent = ""): void {
    console.log(indent + `MinMax [${this.min}:${this.max}]`);
  }
}

class Layer extends Module {
  public readonly inputs: number = 0;
}

/** All nodes in input layer connected to all nodes in output layer */
export class Dense extends Layer {
  private readonly neurons: Neuron[] = [];

  constructor(public readonly inputs: number, nout: number) {
    super();
    for (let i = 0; i < nout; i++) this.neurons.push(new Neuron(inputs));
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

/** A layer of input normalization */
export class Normalization extends Layer {
  private readonly scalers: Scaler[] = [];

  constructor(public readonly inputs: number) {
    super();
    for (let i = 0; i < inputs; i++) this.scalers.push(new Scaler());
  }

  public forward(x: Value[]): Value[] {
    return this.scalers.map((scaler, index) => scaler.forward(x[index]));
  }

  public print(indent = ""): void {
    console.log(indent + "Normalization Layer");
    this.scalers.forEach((n) => n.print(indent + " "));
  }
}

/** A layer of Relu activations */
export class Relu extends Layer {
  private readonly values: Value[] = [];

  public forward(x: Value[]): Value[] {
    return x.map((n) => n.relu());
  }

  public print(indent = ""): void {
    console.log(indent + "Relu Activation");
  }
}

/** A layer of Relu activations */
export class LRelu extends Layer {
  private readonly values: Value[] = [];

  public forward(x: Value[]): Value[] {
    return x.map((n) => n.lrelu());
  }

  public print(indent = ""): void {
    console.log(indent + "Leaky Relu Activation");
  }
}

/** A layer of Sigmoid activations */
export class Sigmoid extends Layer {
  private readonly values: Value[] = [];

  public forward(x: Value[]): Value[] {
    return x.map((n) => n.sigmoid());
  }

  public print(indent = ""): void {
    console.log(indent + "Sigmoid Activation");
  }
}

/** A layer of tanh() activations */
export class Tanh extends Layer {
  private readonly values: Value[] = [];

  public forward(x: Value[]): Value[] {
    return x.map((n) => n.tanh());
  }

  public print(indent = ""): void {
    console.log(indent + "Tanh Activation");
  }
}

/** An array of layers */
export class Network extends Module {
  constructor(
    private readonly layers: Array<
      Dense | Relu | LRelu | Sigmoid | Tanh | Normalization
    >,
  ) {
    super();
  }

  /** Run a set of values through forward propagation and record the output */
  public predict(x: number[]): number[] {
    const xs = x.map((n) => new Value(n));
    const ys = this.forward(xs);
    return ys.map((y) => y.data);
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

  public get inputs(): number {
    return this.layers[0].inputs;
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
