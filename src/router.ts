import { interpretAtomicMatch } from "./opensea/atomicMatch";
import { parseUnknownLogs } from "./opensea/atomicMatchLogs";
import { OpenSeaExchangeAddress } from "./opensea/constants";
import { AtomicMatchBundle } from "./opensea/order";

export const decodeUnknownTransaction = ((data: string, logs: ReceiptLog[], address: string) => {
	console.log('decoding unknown transaction.....')
	switch (address.toLowerCase()) {
		case OpenSeaExchangeAddress.toLowerCase():
			console.log("decoding opensea!")
			const txn = interpretAtomicMatch(data);
			const events = parseUnknownLogs(logs);
			const bundle = { txn, events } as AtomicMatchBundle;
			console.log('bundle:')
			console.log(txn.buy.basePrice);
			console.log(events[0].name)
			if (bundle == null) {
				console.log(txn);
				console.log(events);
				throw new Error("Decoding resulted in null.")
			} else {
				return bundle
			}
		default:
			console.log('unexpected address encountered!!')
			throw new Error("Unknown contract address.")
	}
})

export interface ReceiptLog {
	data: string,
	topics: string[]
}