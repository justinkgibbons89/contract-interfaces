import { decodeAtomicMatch, parseAtomicMatch } from "../opensea/atomicMatch";
import { parseERC721Logs, parseUnknownLog, parseWyvernLogs, parseUnknownLogs } from '../opensea/atomicMatchLogs';
import { ERC721Approval, ERC721Transfer, WyvernOrdersMatched } from '../opensea/events';
import { decodeUnknownTransaction, ReceiptLog } from '../router';
import { OpenSeaExchangeAddress } from '../opensea/constants'
import { data, addresses, calldataBuy, calldataSell, rssMetadata, feeMethodsSidesKindsHowToCalls } from './data';
import { emptyData, transferEventTopics, approvalEventTopics, ordersMatchedData, ordersMatchedTopics, unknownLogSet } from './data';
import { AtomicMatchBundle } from "../opensea/order";

describe("atomic match understanding", () => {
	test('decode an atomicMatch transaction using the wyvern abi', () => {
		const decoded = decodeAtomicMatch(data);
		expect(decoded.args.addrs).toStrictEqual(addresses);
		expect(decoded.args.calldataBuy).toStrictEqual(calldataBuy);
		expect(decoded.args.calldataSell).toStrictEqual(calldataSell);
		expect(decoded.args.rssMetadata).toStrictEqual(rssMetadata);
		expect(decoded.args.feeMethodsSidesKindsHowToCalls).toStrictEqual(feeMethodsSidesKindsHowToCalls);
	})

	test('parse a decoded atomicMatch into a structured object', () => {
		const decoded = decodeAtomicMatch(data);
		const parsed = parseAtomicMatch(decoded)
		expect(parsed.buy.basePrice).toBe(16);
	})

	test('parse a Transfer event', () => {
		const event = parseERC721Logs({ data: emptyData, topics: transferEventTopics });
		const transfer = event as ERC721Transfer;
		expect(transfer).not.toBeNull()
		expect(transfer.arguments.from).toBe("0x2E73E34C50607B8FdFF70323Fa3279f41a522957");
		expect(transfer.arguments.tokenId).toBe(5959);
	});

	test('parse an Approval event', () => {
		const event = parseERC721Logs({ data: emptyData, topics: approvalEventTopics });
		const approval = event as ERC721Approval;
		expect(approval).not.toBeNull()
		expect(approval.arguments.owner).toBe("0x2E73E34C50607B8FdFF70323Fa3279f41a522957");
		expect(approval.arguments.approved).toBe("0x0000000000000000000000000000000000000000");
		expect(approval.arguments.tokenId).toBe(5959);
	});

	test('parse an OrdersMatched event', () => {
		const matched = parseWyvernLogs({ data: ordersMatchedData, topics: ordersMatchedTopics });
		expect(matched.name).toBe("OrdersMatched")
		expect(matched.arguments.taker.toLowerCase()).toBe("0x9b00ccfda8368fc0955542ff3dac45824129113b");
		expect(matched.arguments.price).toBe(16);
	})

	test('parse an unknown log event (which is actually a Transfer)', () => {
		const unknownEvent = parseUnknownLog({ data: emptyData, topics: transferEventTopics });
		const transfer = unknownEvent as ERC721Transfer;
		expect(transfer).not.toBeNull()
		expect(transfer.arguments.from).toBe("0x2E73E34C50607B8FdFF70323Fa3279f41a522957");
		expect(transfer.arguments.tokenId).toBe(5959);
	})

	test('parse an unknown log event (which is actually an OrdersMatched', () => {
		const unknown = parseUnknownLog({ data: ordersMatchedData, topics: ordersMatchedTopics });
		const matched = unknown as WyvernOrdersMatched;
		expect(matched).not.toBe(null);
		expect(matched.arguments.taker.toLowerCase()).toBe("0x9b00ccfda8368fc0955542ff3dac45824129113b");
		expect(matched.arguments.price).toBe(16);
	})

	test('parse a set of unknown logs', () => {
		const logs = parseUnknownLogs(unknownLogSet)

		expect(logs[0].name).toBe('OrdersMatched');
		expect(logs[1].name).toBe('Transfer');
		expect(logs[2].name).toBe('Approval');

	})

	test('decode txn data and event logs for an unknown (atomic match) transaction', () => {
		const decoded = decodeUnknownTransaction(data, unknownLogSet as ReceiptLog[], OpenSeaExchangeAddress);
		const bundle = decoded as AtomicMatchBundle;
		console.log(bundle.txn.buy.basePrice)
		console.log(bundle.events[0].name)
		expect(bundle.txn.buy.basePrice).toBe(16);
		expect(bundle.events[0].name).toBe('OrdersMatched');
		expect(bundle.events[1].name).toBe('Transfer');
		expect(bundle.events[2].name).toBe('Approval');
	})
})