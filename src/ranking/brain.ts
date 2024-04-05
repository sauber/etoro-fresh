import brain from "npm:brain.js@1.6.1";

// provide optional config object (or undefined). Defaults shown.
const config = {
  binaryThresh: 0.5,
  hiddenLayers: [4], // array of ints for the sizes of the hidden layers in the network
  activation: 'leaky-relu', // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
  leakyReluAlpha: 0.01, // supported for activation type 'leaky-relu'
};

// create a simple feed forward neural network with backpropagation
const net = new brain.NeuralNetwork(config);

// Training data
const training = [
  { input: [0, 0], output: [0] },
  { input: [0, 1], output: [1] },
  { input: [1, 0], output: [1] },
  { input: [1, 1], output: [0] },
];

net.train(training);

// Export
const data = net.toJSON();

// Import
const trained = new brain.NeuralNetwork().fromJSON(data);

// Train some more
trained.train(training);

// Predict
console.log(trained.run([0, 0])); // [0.987]
console.log(trained.run([0, 1])); // [0.987]
console.log(trained.run([1, 0])); // [0.987]
console.log(trained.run([1, 1])); // [0.987]
