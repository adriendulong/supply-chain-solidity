const path = require("path");
const HDWallet = require('truffle-hdwallet-provider');
const fs = require('fs');

const mnemonic = fs.readFileSync(".secret").toString().trim();
const infuraKey = fs.readFileSync(".secretInfura").toString().trim();

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: () => new HDWallet(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`),
      network_id: 4,       // Ropsten's id
    },
  },
};