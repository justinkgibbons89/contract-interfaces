import { interpretAtomicMatch } from "./opensea/atomicMatch";
import { parseUnknownLogs } from "./opensea/atomicMatchLogs";
import { OpenSeaExchangeAddress } from "./opensea/constants";
import { AtomicMatchBundle } from "./opensea/order";

export const decodeUnknownTransaction = ((data: string, logs: EventSet[], address: string) => {
	switch (address) {
		case OpenSeaExchangeAddress:
			const txn = interpretAtomicMatch(data);
			const events = parseUnknownLogs(logs);
			const bundle = { txn, events } as AtomicMatchBundle;
			if (bundle == null) {
				console.log(txn);
				console.log(events);
				throw new Error("Decoding resulted in null.")
			} else {
				return bundle
			}
		default:
			throw new Error("Unknown contract address.")
	}
})

export interface EventSet {
	data: string,
	topics: string[]
}