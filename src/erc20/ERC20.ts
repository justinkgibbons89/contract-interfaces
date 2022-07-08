import { ethers } from "ethers";
import { stringFromHex } from "../opensea/atomicMatch.js";
import { ERC20ABI } from "../ABIs/erc20.js";

// An interface for an ERC-20 contract.
export class ERC20 {

	// The underlying contract.
	contract: ethers.Contract;

	// Contract methods
	async name() {
		return await this.contract.name();
	}

	async symbol() {
		return await this.contract.symbol();
	}

	async decimals() {
		return await this.contract.decimals();
	}

	async totalSupply() {
		const bigNumber = await this.contract.totalSupply();
		return stringFromHex(bigNumber._hex);
	}

	async balanceOf(address: string) {
		return await this.contract.balanceOf(address);
	}

	constructor(address: string, provider: ethers.providers.Provider) {
		this.contract = new ethers.Contract(address, ERC20ABI, provider);
	}
}