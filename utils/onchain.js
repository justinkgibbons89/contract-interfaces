import { ethers } from "ethers";

export const decodeLogEvent = (data, topics, abi) => {
	const iface = new ethers.utils.Interface(abi);
	const parsed = iface.parseLog({ data, topics });
	return parsed;
}