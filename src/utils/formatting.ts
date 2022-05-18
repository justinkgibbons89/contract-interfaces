import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils.js";

/// Converts a hexadecimal gwei value to readable units of Ether.
export const convertHexGweiToEth = (hex: string) => {
	const gwei = BigNumber.from(hex);
	const eth = formatEther(gwei);
	return parseInt(eth);
}

export const formatError = ((err: any) => {
	return '!! Caught Error !!\n'
		+ '------------------\n'
		+ err.code + '\n'
		+ err.reason + '\n'
		+ err.argument
		+ ' - '
		+ err.value + '\n------------------';
});