import { Value } from "./value.ts";

export class Node {
  public zeroGrad() {
    this.parameters.forEach((p) => p.grad = 0);
  }

  public get parameters(): Value[] {
    return [];
  }

  public get export() {
    return {};
  }
}
