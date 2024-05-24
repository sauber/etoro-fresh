import { Value, add, div, mul, pow } from './mod.ts';

const a = new Value(4.0)
const b = new Value(-2.0)
const c = add(a, b)
const d = add(mul(a, b), pow(b, new Value(3)))
const e = new Value(3.0)
const f = div(d, e)
f.backward(); // compute the gradient of f with respect to all the variables in the graph
console.log(f.data); // print the data of f: -5.3333333333333333
console.log(a.grad); // print the gradient of f with respect to a: -0.6666666666666666
console.log(b.grad); // print the gradient of f with respect to b: 5.333333333333333
