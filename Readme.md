## Wallet contract test

- test contracts address are under contracts.txt
- It is required to deploy wallet contract over testnet on wallet-contract hardhat project
- backend will run and sync all events from token contract and wallet contract and then detect events for deposit ERC20 and ETH
- Wallet contract is designated for transfer ETH automatically when it received from other address
- Wallet contract has one method to transfer ERC20 token to admin wallet. Here the problem is currently it doesnt' detect event when it receive ERC20 tokens (which ERC777 is trying to solve)