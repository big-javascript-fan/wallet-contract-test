const { ethers } = require("hardhat");

async function main() {
  const tokenInstance = await ethers.getContractFactory("TestERC20");
  const tokenContract = await tokenInstance.deploy();

  const walletInstance = await ethers.getContractFactory("SimpleWallet");
  const walletContract = await walletInstance.deploy();
  console.log("token contract deployed to:", tokenContract.address);
  console.log('wallet contract deployed to:', walletContract.address);
}

main();