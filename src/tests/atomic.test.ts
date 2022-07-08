import { decodeAtomicMatch, parseAtomicMatch, numberFromHex, stringFromHex } from "../opensea/atomicMatch.js";
import { parseERC721Logs, parseUnknownLog, parseWyvernLogs, parseUnknownLogs } from '../opensea/atomicMatchLogs.js';
import { ERC721Approval, ERC721Transfer, WyvernOrdersMatched } from '../opensea/events.js';
import { ERC20ABI } from "../ABIs/erc20.js";
import { ERC721ABI } from "../erc721/abi.js";
import { ERC721 } from "../erc721/contract.js";
import { decodeUnknownTransaction, describeUnknownTransaction, ReceiptLog } from '../router.js';
import { OpenSeaExchangeAddress } from '../opensea/constants.js'
import { AtomicMatchBundle } from "../opensea/order.js";
import { ethers } from "ethers";
import * as data from './testData.js';
import { jest } from '@jest/globals'
import 'dotenv/config'

describe("wyvern txns", () => {
	test('decode an atomicMatch transaction using the wyvern abi', () => {
		const decoded = decodeAtomicMatch(data.atomicMatchData);
		expect(decoded.args.addrs).toStrictEqual(data.addresses);
		expect(decoded.args.calldataBuy).toStrictEqual(data.calldataBuy);
		expect(decoded.args.calldataSell).toStrictEqual(data.calldataSell);
		expect(decoded.args.rssMetadata).toStrictEqual(data.rssMetadata);
		expect(decoded.args.feeMethodsSidesKindsHowToCalls).toStrictEqual(data.feeMethodsSidesKindsHowToCalls);
	})

	test('parse a decoded atomicMatch into a structured object', () => {
		const decoded = decodeAtomicMatch(data.atomicMatchData);
		const parsed = parseAtomicMatch(decoded)
		expect(parsed.buy.basePrice).toBe(16);
	})

	test('parse a Transfer event', () => {
		const event = parseERC721Logs({ data: data.emptyData, topics: data.transferEventTopics, address: data.OthersideAddress });
		const transfer = event as ERC721Transfer;
		expect(transfer).not.toBeNull()
		expect(transfer.arguments.from).toBe("0x2E73E34C50607B8FdFF70323Fa3279f41a522957");
		expect(transfer.arguments.tokenId).toBe(5959);
	});

	test('parse an Approval event', () => {
		const event = parseERC721Logs({ data: data.emptyData, topics: data.approvalEventTopics, address: data.OthersideAddress });
		const approval = event as ERC721Approval;
		expect(approval).not.toBeNull()
		expect(approval.arguments.owner).toBe("0x2E73E34C50607B8FdFF70323Fa3279f41a522957");
		expect(approval.arguments.approved).toBe("0x0000000000000000000000000000000000000000");
		expect(approval.arguments.tokenId).toBe(5959);
	});

	test('parse an OrdersMatched event', () => {
		const matched = parseWyvernLogs({ data: data.ordersMatchedData, topics: data.ordersMatchedTopics, address: OpenSeaExchangeAddress });
		expect(matched.name).toBe("OrdersMatched")
		expect(matched.arguments.taker.toLowerCase()).toBe("0x9b00ccfda8368fc0955542ff3dac45824129113b");
		expect(matched.arguments.price).toBe(16);
	})

	test('parse an unknown log event (which is actually a Transfer)', () => {
		const unknownEvent = parseUnknownLog({ data: data.emptyData, topics: data.transferEventTopics, address: data.OthersideAddress });
		const transfer = unknownEvent as ERC721Transfer;
		expect(transfer).not.toBeNull()
		expect(transfer.arguments.from).toBe("0x2E73E34C50607B8FdFF70323Fa3279f41a522957");
		expect(transfer.arguments.tokenId).toBe(5959);
	})

	test('parse an unknown log event (which is actually an OrdersMatched', () => {
		const unknown = parseUnknownLog({ data: data.ordersMatchedData, topics: data.ordersMatchedTopics, address: OpenSeaExchangeAddress });
		const matched = unknown as WyvernOrdersMatched;
		expect(matched).not.toBe(null);
		expect(matched.arguments.taker.toLowerCase()).toBe("0x9b00ccfda8368fc0955542ff3dac45824129113b");
		expect(matched.arguments.price).toBe(16);
	})

	test('parse a set of unknown logs', () => {
		const logs = parseUnknownLogs(data.unknownLogSet)

		expect(logs[0].name).toBe('OrdersMatched');
		expect(logs[1].name).toBe('Transfer');
		expect(logs[2].name).toBe('Approval');

	})

	test('decode txn data and event logs for an unknown (atomic match) transaction', () => {
		const decoded = decodeUnknownTransaction(data.atomicMatchData, data.unknownLogSet as ReceiptLog[], OpenSeaExchangeAddress);
		const bundle = decoded as AtomicMatchBundle;
		expect(bundle.txn.buy.basePrice).toBe(16);
		expect(bundle.events[0].name).toBe('OrdersMatched');
		expect(bundle.events[1].name).toBe('Transfer');
		expect(bundle.events[2].name).toBe('Approval');
		expect(bundle.events[0].address).toBe(OpenSeaExchangeAddress);
		expect(bundle.events[1].address).toBe(data.OthersideAddress);
	})

	test('give a human readable description of a transaction/event sequence', () => {
		const desc = describeUnknownTransaction(data.atomicMatchData, data.unknownLogSet as ReceiptLog[], OpenSeaExchangeAddress)

		expect(desc.tokenId).toBe(5959);
		expect(desc.collection).toBe(data.OthersideAddress);
		expect(desc.market).toBe(OpenSeaExchangeAddress);
		expect(desc.price).toBe(16);
	})
})

describe("erc-721 txns", () => {
	test('decode a setApprovalForAll transaction', () => {
		const ifc = new ethers.utils.Interface(ERC721ABI);
		const parsed = ifc.parseTransaction({ data: data.genericERC721SetApprovalCallData });
		expect(parsed.args.operator).toBe(data.genericERC721OperatorResult);
		expect(parsed.args.approved).toBe(data.genericERC721ApprovedResult)
	})

	test('decode a transferFrom transaction', () => {
		const ifc = new ethers.utils.Interface(ERC721ABI);
		const parsed = ifc.parseTransaction({ data: data.genericERC721TransferFromData });
		expect(parsed.args.from).toBe(data.erc721TransferResultFrom)
		expect(parsed.args.to).toBe(data.erc721TransferResultTo);
		expect(numberFromHex(parsed.args.tokenId._hex)).toBe(data.erc721TransferResultTokenId);
	})

	test('decode a safeTransferFrom transaction', () => {
		const ifc = new ethers.utils.Interface(ERC721ABI);
		const parsed = ifc.parseTransaction({ data: data.erc721SafeTransferFromData });
		expect(parsed.args.from).toBe(data.erc721SafeTransferResultFrom)
		expect(parsed.args.to).toBe(data.erc721SafeTransferResultTo);
		expect(numberFromHex(parsed.args.tokenId._hex)).toBe(data.erc721SafeTransferResultTokenId);
	})
})

describe("erc-20 txns", () => {
	test('decode an approve transaction', () => {
		const ifc = new ethers.utils.Interface(ERC20ABI);
		const parsed = ifc.parseTransaction({ data: data.erc20ApproveData });
		expect(parsed.args.spender).toBe(data.erc20ApproveResultSpender)
		expect(stringFromHex(parsed.args.amount._hex)).toBe(data.erc20ApproveResultAmount);
	})

	test('decode a transfer transaction', () => {
		const ifc = new ethers.utils.Interface(ERC20ABI);
		const parsed = ifc.parseTransaction({ data: data.erc20TransferData });
		expect(parsed.args.to).toBe(data.erc20TransferResultRecipient);
		expect(stringFromHex(parsed.args.value._hex)).toBe(data.erc20TransferResultAmount);
	})
})

describe("erc-721 contract", () => {
	jest.setTimeout(60000);
	const provider = new ethers.providers.EtherscanProvider(process.env.NETWORK, process.env.ALCHEMYKEY);
	const otherdeed = new ERC721(data.OtherdeedAddress, provider)

	test('get the name', async () => {
		const name = await otherdeed.name()
		expect(name).toBe("Otherdeed");
	})

	test('get the symbol', async () => {
		const symbol = await otherdeed.symbol()
		expect(symbol).toBe("OTHR")
	})

	test('get the image URL', async () => {
		const image = await otherdeed.imageURL(4626)
		expect(image).toBe("https://assets.otherside.xyz/otherdeeds/2316c364363835011369d1079d750408cf212410c9081aca201f98f44c8edf65.jpg")
	})

	test('get the some attributes from the metadata', async () => {
		const attributes = await otherdeed.attributes(4626)
		expect(attributes[0].trait_type).toBe("Category")
		expect(attributes[0].value).toBe("Spirit")

		expect(attributes[3].trait_type).toBe("Environment")
		expect(attributes[3].value).toBe("Steppes")
	})
})