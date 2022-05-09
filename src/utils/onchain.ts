import { ethers } from "ethers";

export const decodeLogEvent = (data: string, topics: [string], abi: any) => {
	const iface = new ethers.utils.Interface(abi);
	const parsed = iface.parseLog({ data, topics });
	return parsed;
}