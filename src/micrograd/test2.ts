import { getLoss, MLP, toValues, Value } from "./mod.ts";

const n = new MLP(3, [4, 4, 1]); // create a multilayer perceptron model with 3 input units, 2 hidden layers with 4 units each, and 1 output unit

const xs = [
  [2.0, 3.0, -1.0],
  [3.0, -1.0, 0.5],
  [0.5, 1.0, 1.0],
  [1.0, 1.0, -1.0],
].map((x) => toValues(x)); // create an array of input values from an array of numbers
const ys = toValues([1.0, -1.0, -1.0, 1.0]); // create an array of output values from an array of numbers
const parameters = n.parameters();

for (let i = 0; i < 20; i++) { // train the model for 200 iterations
  const ypred = xs.map((x) => n.run(x)); // run the model on each input and get an array of predictions
  const loss = getLoss(ys, ypred as Value[]); // compute the mean squared error loss between the predictions and the outputs

  for (const p of parameters) { // loop over all the parameters of the model
    p.grad = 0; // reset their gradients to zero
  }
  loss.backward(); // compute the gradient of the loss with respect to all the parameters

  for (const p of parameters) { // loop over all the parameters of the model
    p.data -= 0.01 * p.grad; // update their data by subtracting a small fraction of their gradients
  }

  console.log(i, loss.data); // print the iteration number and the loss value
}
