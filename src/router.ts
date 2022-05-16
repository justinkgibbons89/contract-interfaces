import { interpretAtomicMatch } from "./opensea/atomicMatch";
import { parseUnknownLogs } from "./opensea/atomicMatchLogs";
import { OpenSeaExchangeAddress } from "./opensea/constants";
import { AtomicMatchBundle } from "./opensea/order";

export const decodeUnknownTransaction = ((data: string, logs: EventSet[], address: string) => {
	switch (address) {
		case OpenSeaExchangeAddress:
			const txn = interpretAtomicMatch(data);
			const events = parseUnknownLogs(logs);
			return { txn, events } as AtomicMatchBundle;
		default:
			throw new Error("Unknown contract address.")
	}
})

export interface EventSet {
	data: string,
	topics: string[]
}