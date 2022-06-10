# Learn Blockchain

This is a project to learn about blockchain technology and how it can be used to create a blockchain.

## What is a blockchain?

Blockchain is a series of records, called blocks, stored in a public ledger. Each block contains a cryptographic hash of the previous block, a timestamp, and transaction data.

## Development

To clone and setup the project, run the following command:

```
$ git clone https://github.com/eavelasquez/learn-blockchain.git
$ cd learn-blockchain
$ yarn install
```

To run the project, run the following command:

```
$ yarn start:instance 1 # Starts a server instances on port 3000 and 5000 (default)
$ yarn start:instance 2 # Starts a server instances on port 3001 and 5001
```

To test the project, run the following command:

```
$ yarn test
```

## Next Steps

1. Add a new endpoints /wallet
  1. Add a new endpoint /wallet/create
  1. Add a new endpoint /wallet/:address/balance
  1. Add a new endpoint /wallet/:address/transactions
1. Include a fee in the transaction
  NOTE: The fee is the amount of coins that are sent to the miner as a reward.
1. A client application that can create, send, and receive coins, etc.
1. Improve the mining logic so that it selects a maximum number of transactions according to the fees.
