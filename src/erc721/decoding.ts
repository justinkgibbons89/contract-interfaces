const LooksRareAddress = "0xf4d2888d29D722226FafA5d9B24F9164c092421E";
import { ethers } from "ethers";
import { ERC721ABI } from "../opensea/constants";

export const decodeERC721Transaction = (data: string) => {
	const ifc = new ethers.utils.Interface(ERC721ABI);
	const parsed = ifc.parseTransaction({ data: data });
	return parsed;
}

export const tryDecodeERC721Transaction = (data: string) => {
	try {
		return decodeERC721Transaction(data);
	} catch (err) {
		console.log(err);
		return null
	}
}

/// Decodes the given transaction data using the given ABI.
export const decodeTransaction = (data: string, abi: string[]) => {
	const ifc = new ethers.utils.Interface(abi);
	const parsed = ifc.parseTransaction({ data });
	return parsed;
}

/// Tries to decode the given data with the given ABI, catching any errors and returning null if the decoding fails.
export const tryDecodeTransaction = (data: string, abi: string[]) => {
	try {
		return decodeTransaction(data, abi);
	} catch (err) {
		console.log(err);
		return null
	}
}