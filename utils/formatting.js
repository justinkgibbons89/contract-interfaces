import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";

/// Converts a hexadecimal gwei value to readable units of Ether.
export const convertHexGweiToEth = (hex) => {
	const gwei = BigNumber.from(hex);
	const eth = formatEther(gwei);
	return eth;
}
