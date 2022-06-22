import { TransactionDescription } from "ethers/lib/utils";
import { tryDecodeERC721Transaction, tryDecodeTransaction } from "./erc721/decoding";
import { interpretAtomicMatch } from "./opensea/atomicMatch";
import { parseUnknownLogs } from "./opensea/atomicMatchLogs";
import { ERC20ABI, OpenSeaExchangeAddress } from "./opensea/constants";
import { describeTransaction } from "./opensea/description";

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