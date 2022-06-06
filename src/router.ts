import { interpretAtomicMatch } from "./opensea/atomicMatch";
import { parseUnknownLogs } from "./opensea/atomicMatchLogs";
import { OpenSeaExchangeAddress } from "./opensea/constants";
import { describeTransaction } from "./opensea/description";
import { AtomicMatchBundle, TransactionBundle } from "./opensea/order";


export const describeUnknownTransaction = ((data: string, logs: ReceiptLog[], address: string) => {
	const bundle = decodeUnknownTransaction(data, logs, address);
	const desc = describeTransaction(bundle);
	return desc
	//switch (address.toLowerCase()) {
	//	case OpenSeaExchangeAddress.toLowerCase():
	//		const txn = interpretAtomicMatch(data);
	//		const events = parseUnknownLogs(logs);
	//		const bunlde = { txn, events }
	//		describeTransaction(bundle);
	//	default:
	//		throw new Error("Unknown contract address.")
	//}
})

export const decodeUnknownTransaction = ((data: string, logs: ReceiptLog[], address: string) => {
	switch (address.toLowerCase()) {
		case OpenSeaExchangeAddress.toLowerCase():
			const txn = interpretAtomicMatch(data);
			const events = parseUnknownLogs(logs);
			return { txn, events }

		default:
			throw new Error("Unknown contract address.")
	}
})

export interface ReceiptLog {
	address: string,
	data: string,
	topics: string[]
}