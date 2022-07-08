import { TransactionDescription } from "ethers/lib/utils.js";
import { tryDecodeERC721Transaction, tryDecodeTransaction } from "./erc721/transactions.js";
import { interpretAtomicMatch } from "./opensea/atomicMatch.js";
import { parseUnknownLogs } from "./opensea/atomicMatchLogs.js";
import { OpenSeaExchangeAddress } from "./opensea/constants.js";
import { describeTransaction } from "./opensea/description.js";
import { ERC20ABI } from "./ABIs/erc20.js";

export const describeUnknownTransaction = ((data: string, logs: ReceiptLog[], address: string) => {
	const bundle = decodeUnknownTransaction(data, logs, address);
	const desc = describeTransaction(bundle);
	return desc
})

// Takes unknown transaction data (and optionally its logs) for a given address and attempts to return a decoded bundle.
// Decoding returns the "raw" transaction in a readable and structured way. 
// To get the *meaning* of the transaction, call the `describe` function instead.
export const decodeUnknownTransaction = ((data: string, logs: ReceiptLog[], address: string) => {

	let decoded: TransactionDescription | null = null;

	// Handle known addresses
	switch (address.toLowerCase()) {
		case OpenSeaExchangeAddress.toLowerCase():
			const txn = interpretAtomicMatch(data);
			const events = parseUnknownLogs(logs);
			return { txn, events }
		default:
			console.log('unknown address...')
	}

	// Try known interfaces (generic erc-721, erc-20, erc-1151)
	decoded = tryDecodeERC721Transaction(data) ?? decoded;
	decoded = tryDecodeTransaction(data, ERC20ABI) ?? decoded;

	throw new Error("No bundle.")
})

export interface ReceiptLog {
	address: string,
	data: string,
	topics: string[]
}