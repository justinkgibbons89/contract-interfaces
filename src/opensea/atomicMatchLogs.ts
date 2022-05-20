import { ERC721ABI } from './constants'
import { ERC721Approval, ERC721Transfer, WyvernOrdersMatched, Event } from './events';
import { ethers } from 'ethers';
import { numberFromHex } from './atomicMatch';
import { convertHexGweiToEth } from '../utils/formatting';
import wyvernABI from './ABIs/wyvernExchangeABI.json';
import { formatError } from '../utils/formatting';
import { ReceiptLog } from '../router';
import { parse, stringify } from 'ts-jest';

export const parseUnknownLogs = ((logs: ReceiptLog[]) => {
	//let events: any = {}
	//for (const log of logs) {
	//	const parsed = parseUnknownLog(log);
	//	events[parsed.name] = parsed;
	//}
	//return events
	return logs.map(log => {
		return parseUnknownLog(log);
	}) as Event[]
})

export const parseUnknownLog = ((log: ReceiptLog) => {
	try {
		const erc721Event = parseERC721Logs(log);
		if (erc721Event) { return erc721Event };
	} catch (err: any) {
		// ignore error 
		if (err.code = ! "INVALID_ARGUMENT") {
			console.log(formatError(err));
		}
	}

	try {
		const wyvernEvent = parseWyvernLogs(log);
		if (wyvernEvent) { return wyvernEvent }
	} catch (err: any) {
		// ignore error 
		if (err.code = ! "INVALID_ARGUMENT") {
			console.log(formatError(err));
		}
	}

	throw new Error("Couldn't parse log!")
})


export const parseERC721Logs = (({ data, topics, address }: ReceiptLog) => {
	const ifc = new ethers.utils.Interface(ERC721ABI);
	const event = ifc.parseLog({ topics, data })
	switch (event.name) {
		case "Transfer": return transferFromEvent(event, address);
		case "Approval": return approvalFromEvent(event, address);
		default: return null;
	}
});

export const parseWyvernLogs = (({ data, topics, address }: ReceiptLog) => {
	const ifc = new ethers.utils.Interface(wyvernABI);
	const event = ifc.parseLog({ topics, data });
	return ordersMatchedFromEvent(event, address);
})

const transferFromEvent = ((event: any, address: string) => {
	return {
		address: address,
		name: event.name,
		arguments: {
			from: event.args.from,
			to: event.args.to,
			tokenId: numberFromHex(event.args.tokenId._hex)
		}
	} as ERC721Transfer
})

const approvalFromEvent = ((event: any, address: string) => {
	return {
		address: address,
		name: event.name,
		arguments: {
			owner: event.args.owner,
			approved: event.args.approved,
			tokenId: numberFromHex(event.args.tokenId._hex)
		}
	} as ERC721Approval
})

const ordersMatchedFromEvent = ((event: any, address: string) => {
	return {
		address: address,
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
