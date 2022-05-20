import { interpretAtomicMatch } from "./opensea/atomicMatch";
import { parseUnknownLogs } from "./opensea/atomicMatchLogs";
import { OpenSeaExchangeAddress } from "./opensea/constants";
import { AtomicMatchBundle } from "./opensea/order";

const describeBundle = (bundle: AtomicMatchBundle) => {
	//if (bundle.events.includes)
}

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