import { ERC721ABI } from '../ABIs/erc721.js';
import { ERC721Approval, ERC721Transfer, WyvernOrdersMatched, Event } from './events.js';
import { ethers } from 'ethers';
import { numberFromHex } from './atomicMatch.js';
import { convertHexGweiToEth, formatError } from '../utils/formatting.js';
import { WyvernABI } from '../ABIs/wyvernV2.js'
import { ReceiptLog } from '../router.js';

export const parseUnknownLogs = ((logs: ReceiptLog[]) => {
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
	const ifc = new ethers.utils.Interface(WyvernABI);
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
