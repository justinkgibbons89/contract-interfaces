import { interpretAtomicMatch } from "./opensea/atomicMatch";
import { parseUnknownLogs } from "./opensea/atomicMatchLogs";
import { OpenSeaExchangeAddress } from "./opensea/constants";

export const decodeUnknownTransaction = (({ data, logs, address }) => {
	switch (address) {
		case OpenSeaExchangeAddress:
			const txn = interpretAtomicMatch(data);
			const events = parseUnknownLogs(logs);
			return { txn, events };
		default: return null;
	}
})