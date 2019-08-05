const Web3 = require("web3");
const web3 = new Web3("http://127.0.0.1:8545");

const address = process.env.FROM_ADDRESS;
const contractAddress = process.env.CONTRACT_ADDRESSS;
const ABI = [
  {
    constant: true,
    inputs: [],
    name: "getName",
    outputs: [
      {
        name: "",
        type: "string"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "_points",
        type: "uint256"
      },
      {
        name: "_playerName",
        type: "string"
      }
    ],
    name: "setPoints",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getPoints",
    outputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  }
];

var contract = new web3.eth.Contract(ABI, contractAddress);

const express = require("express");
const app = express();

app.use(express.static("public"));

const PORT = 3000;
app.listen(PORT, () => console.log(`SERVER STARTED ON PORT: ${PORT}`));

app.post("/add-highscore", (request, response) => {
  const points = request.query.points;
  const name = request.query.name;
  console.log("Player: ", name, "sent: ", points);
  contract.methods
    .setPoints(points, name)
    .send({ from: address })
    .then(e => response.send("Points added"));
});
app.get("/get-highscore", (request, response) => {
  contract.methods
    .getPoints()
    .call({ from: address })
    .then(result => response.send(result));
});
app.get("/get-playerName", (request, response) => {
  contract.methods
    .getName()
    .call({ from: address })
    .then(result => response.send(result));
});
