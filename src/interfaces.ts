import { ethers, getDefaultProvider } from "ethers";
import { ERC1155ABI } from "./ABIs/erc1155.js";
import { ERC165ABI } from "./ABIs/erc165.js";
import { ERC20ABI } from "./ABIs/erc20.js";
import { ERC4626 } from "./ABIs/erc4626.js";
import { ERC721ABI } from "./ABIs/erc721.js";

const provider = new ethers.providers.EtherscanProvider(process.env.NETWORK, process.env.ALCHEMYKEY);

// Interface IDs for ERC-165 
export const ERC165ID = "0x01ffc9a7";
export const ERC721ID = "0x80ac58cd";
export const ERC20ID = "0x36372b07";
export const ERC1155 = "0x4e2312e0";

// Returns `true` if the addressed contract supports the ERC-165 interface.
export const supportsERC165 = async (address: string) => {
	return await supportsInterface(address, ERC721ABI, "0x01ffc9a7")
}

// Returns `true` if the addressed contract supports the ERC-721 interface.
export const supportsERC721 = async (address: string) => {
	return await supportsInterface(address, ERC721ABI, "0x80ac58cd")
}

// Returns `true` if the addressed contract supports the ERC-20 interface.
export const supportsERC20 = async (address: string) => {
	return await supportsInterface(address, ERC20ABI, "0x36372b07")
}

// Returns `true` if the addressed contract supports the ERC-1155 interface.
export const supportsERC1155 = async (address: string) => {
	return await supportsInterface(address, ERC1155ABI, "0x4e2312e0")
}

// Returns `true` if the addressed contract supports the ERC-4626 interface.
export const supportsERC4626 = async (address: string) => {
	return await supportsInterface(address, ERC4626, "0xxx")
}

// Checks if the given address/abi supports the identified interface. 
export const supportsInterface = async (address: string, abi: string[], interfaceId: string) => {
	const compositeABI = ERC165ABI.concat(abi);
	try {
		const contract = new ethers.Contract(address, compositeABI, provider);
		return await contract.supportsInterface(interfaceId);
	} catch {
		//console.log('ERROR');
		return false
	}
}

// Smart contract interface standards.
export enum Interface {
	ERC165 = "165",
	ERC721 = "721",
	ERC20 = "20",
	ERC1155 = "1155",
	ERC4626 = "4626"
}

// Returns a list of interface standards supported by the addressed contract. Throws an error if no standards are supported.
export const determineInterfaces = async (address: string) => {
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