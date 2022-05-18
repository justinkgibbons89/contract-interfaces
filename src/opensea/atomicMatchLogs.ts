import { ERC721ABI } from './constants'
import { ERC721Approval, ERC721Transfer, WyvernOrdersMatched, LogEvent } from './events';
import { ethers } from 'ethers';
import { numberFromHex } from './atomicMatch';
import { convertHexGweiToEth } from '../utils/formatting';
import wyvernABI from './ABIs/wyvernExchangeABI.json';
import { formatError } from '../utils/formatting';
import { ReceiptLog } from '../router';

export const parseUnknownLogs = ((logs: ReceiptLog[]) => {
	return logs.map(log => {
		return parseUnknownLog(log);
	}) as LogEvent[]
})

export const parseUnknownLog = ((log: ReceiptLog) => {
	try {
		const erc721Event = parseERC721Logs({ data: log.data, topics: log.topics });
		if (erc721Event) { return erc721Event };
	} catch (err: any) {
		// ignore error 
		if (err.code = ! "INVALID_ARGUMENT") {
			console.log(formatError(err));
		}
	}

	try {
		const wyvernEvent = parseWyvernLogs({ data: log.data, topics: log.topics });
		if (wyvernEvent) { return wyvernEvent }
	} catch (err: any) {
		// ignore error 
		if (err.code = ! "INVALID_ARGUMENT") {
			console.log(formatError(err));
		}
	}

	console.log("Couldn't parse logs!");
	return null;
})


export const parseERC721Logs = (({ data, topics }: ReceiptLog) => {
	const ifc = new ethers.utils.Interface(ERC721ABI);
	const event = ifc.parseLog({ topics, data })

	switch (event.name) {
		case "Transfer": return transferFromEvent(event);
		case "Approval": return approvalFromEvent(event);
		default: return null;
	}
});

export const parseWyvernLogs = (({ data, topics }: ReceiptLog) => {
	const ifc = new ethers.utils.Interface(wyvernABI);
	const event = ifc.parseLog({ topics, data });
	return ordersMatchedFromEvent(event);
})

const transferFromEvent = ((event: any) => {
	return {
		name: event.name,
		arguments: {
			from: event.args.from,
			to: event.args.to,
			tokenId: numberFromHex(event.args.tokenId._hex)
		}
	} as ERC721Transfer
})

const approvalFromEvent = ((event: any) => {
	return {
		name: event.name,
		arguments: {
			owner: event.args.owner,
			approved: event.args.approved,
			tokenId: numberFromHex(event.args.tokenId._hex)
		}
	} as ERC721Approval
})

const ordersMatchedFromEvent = ((event: any) => {
	return {
		name: event.name,
		arguments: {
			maker: event.args.maker,
			taker: event.args.taker,
			buyHash: event.args.buyHash,
			sellHash: event.args.sellHash,
			price: convertHexGweiToEth(event.args.price._hex)
		}
	} as WyvernOrdersMatched;
})
