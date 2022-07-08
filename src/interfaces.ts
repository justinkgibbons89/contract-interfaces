import { ethers } from "ethers";
import { ERC1155ABI } from "./ABIs/erc1155.js";
import { ERC165ABI } from "./ABIs/erc165.js";
import { ERC20ABI } from "./ABIs/erc20.js";
import { ERC4626ABI } from "./ABIs/erc4626.js";
import { ERC721ABI } from "./ABIs/erc721.js";
import { WyvernABI } from "./ABIs/wyvernV2.js";

// Interface standards supported by this library. A single contract can support multiple standards.
export enum Interface {
	// Interface signaling extension.
	ERC165 = "ERC-165",

	// Non-fungible tokens. Doesn't necessarily include metadata.
	ERC721 = "ERC-721",

	// The metadata extension for ERC-721.
	ERC721Metadata = "ERC-721 Metadata",

	// Fungible tokens.
	ERC20 = "ERC-20",

	// Batch-transferrable NFTs.
	ERC1155 = "ERC-1155",

	// Yield-bearing vault tokens.
	ERC4626 = "ERC-4626",

	// Exchange protocol for atomic swaps. Previously by OpenSea.
	Wyvern = "Wyenvern 2.0",

	// Exchange protocol for atomic swaps. Currenty used by OpenSea
	Seaport = "Seaport"
}

export namespace Interface {

	export function abi(standard: Interface): any {
		switch (standard) {
			case Interface.ERC165: return ERC165ABI;
			case Interface.ERC20: return ERC20ABI;
			case Interface.ERC721: return ERC721ABI;
			case Interface.ERC721Metadata: return ERC721ABI;
			case Interface.ERC1155: return ERC1155ABI;
			case Interface.ERC4626: return ERC4626ABI;
			case Interface.Wyvern: return WyvernABI;
			case Interface.Seaport: return WyvernABI;
		}
	}

	export function id(standard: Interface): string {
		switch (standard) {
			case Interface.ERC165: return "0x01ffc9a7";
			case Interface.ERC20: return "0x36372b07";
			case Interface.ERC721: return "0x80ac58cd";
			case Interface.ERC721Metadata: return "0x80ac58cd";
			case Interface.ERC1155: return "0x4e2312e0";
			case Interface.ERC4626: throw new Error("ERC-4626 ID not supported yet.")
			case Interface.Wyvern: throw new Error("Wyvern ID not supported yet.")
			case Interface.Seaport: throw new Error("Seaport ID not supported yet.")
		}
	}
}

// Returns `true` if the addressed contract supports the ERC-165 interface.
export const supportsERC165 = async (address: string) => {
	const i = Interface.ERC165;
	return await supportsInterface(address, Interface.abi(i), Interface.id(i))
}

// Returns `true` if the addressed contract supports the ERC-721 interface.
export const supportsERC721 = async (address: string) => {
	const i = Interface.ERC721;
	return await supportsInterface(address, Interface.abi(i), Interface.id(i))
}

// Returns `true` if the addressed contract supports the ERC-20 interface.
export const supportsERC20 = async (address: string) => {
	const i = Interface.ERC20;
	return await supportsInterface(address, Interface.abi(i), Interface.id(i))
}

// Returns `true` if the addressed contract supports the ERC-1155 interface.
export const supportsERC1155 = async (address: string) => {
	const i = Interface.ERC1155;
	return await supportsInterface(address, Interface.abi(i), Interface.id(i))
}

// Returns `true` if the addressed contract supports the ERC-4626 interface.
export const supportsERC4626 = async (address: string) => {
	const i = Interface.ERC4626;
	return await supportsInterface(address, Interface.abi(i), Interface.id(i))
}

// Checks if the given address/abi supports the identified interface. In most cases, the generalized `getInterfaces` is more convenient than this method.
export const supportsInterface = async (address: string, abi: string[], interfaceId: string) => {
	// web3 provider
	const provider = new ethers.providers.EtherscanProvider(process.env.NETWORK, process.env.ALCHEMYKEY);

	const compositeABI = ERC165ABI.concat(abi);
	try {
		const contract = new ethers.Contract(address, compositeABI, provider);
		return await contract.supportsInterface(interfaceId);
	} catch { //console.log('ERROR');
		return false
	}
}

// Returns a list of interface standards supported by the addressed contract. Throws an error if no standards are supported.
export const getInterfaces = async (address: string) => {
	let supported: Interface[] = []

	if (await supportsERC165(address)) { supported.push(Interface.ERC165) }
	if (await supportsERC721(address)) { supported.push(Interface.ERC721) }
	if (await supportsERC20(address)) { supported.push(Interface.ERC20) }
	if (await supportsERC1155(address)) { supported.push(Interface.ERC1155) }
	if (await supportsERC4626(address)) { supported.push(Interface.ERC4626) }

	if (supported.length > 0) {
		return supported
	} else {
		throw new Error("Couldn't determine interface for contract " + address);
	}
}