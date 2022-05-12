import { decodeAtomicMatch, parseAtomicMatch } from "../opensea/atomicMatch";
import { parseERC721Logs, parseWyvernLogs } from '../opensea/atomicMatchLogs';
import { ERC721Approval, ERC721Transfer } from '../opensea/events';

/* ----------------------
|		Definition	     |
 ---------------------- */

describe("atomic match understanding", () => {
	test('decodes an atomicMatch transaction using the wyvern abi', () => {
		const decoded = decodeAtomicMatch(data);
		expect(decoded.args.addrs).toStrictEqual(addresses);
		expect(decoded.args.calldataBuy).toStrictEqual(calldataBuy);
		expect(decoded.args.calldataSell).toStrictEqual(calldataSell);
		expect(decoded.args.rssMetadata).toStrictEqual(rssMetadata);
		expect(decoded.args.feeMethodsSidesKindsHowToCalls).toStrictEqual(feeMethodsSidesKindsHowToCalls);
	})

	test('parses a decoded atomicMatch into a structured object', () => {
		const decoded = decodeAtomicMatch(data);
		const parsed = parseAtomicMatch(decoded)
		expect(parsed.buy.basePrice).toBe(16);
	})

	//test('interprets a transaction', () => {
	//	const interpreted = interpretAtomicMatch(data);
	//	expect(interpreted.buy.basePrice).toBe(16);
	//})

	test('parses a Transfer event', () => {
		const event = parseERC721Logs({ data: emptyData, topics: transferEventTopics });
		const transfer = event as ERC721Transfer;
		expect(transfer).not.toBeNull()
		expect(transfer.arguments.from).toBe("0x2E73E34C50607B8FdFF70323Fa3279f41a522957");
		expect(transfer.arguments.tokenId).toBe(5959);
	});

	test('parses an Approval event', () => {
		const event = parseERC721Logs({ data: emptyData, topics: approvalEventTopics });
		const approval = event as ERC721Approval;
		expect(approval).not.toBeNull()
		expect(approval.arguments.owner).toBe("0x2E73E34C50607B8FdFF70323Fa3279f41a522957");
		expect(approval.arguments.approved).toBe("0x0000000000000000000000000000000000000000");
		expect(approval.arguments.tokenId).toBe(5959);
	});

	test('parses an OrdersMatched event', () => {
		const matched = parseWyvernLogs({ data: ordersMatchedData, topics: ordersMatchedTopics });
		expect(matched.name).toBe("OrdersMatched")
		expect(matched.arguments.taker.toLowerCase()).toBe("0x9b00ccfda8368fc0955542ff3dac45824129113b");
		expect(matched.arguments.price).toBe(16);
	})
})

/* ----------------------
|		   Data      	 |
 ---------------------- */

// Input 
const data = "0xab834bab0000000000000000000000007f268357a8c2552623316e2562d90e642bb538e50000000000000000000000009b00ccfda8368fc0955542ff3dac45824129113b0000000000000000000000002e73e34c50607b8fdff70323fa3279f41a5229570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000baf2127b49fc93cbca6269fade0f7f31df4c88a7000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007f268357a8c2552623316e2562d90e642bb538e50000000000000000000000002e73e34c50607b8fdff70323fa3279f41a52295700000000000000000000000000000000000000000000000000000000000000000000000000000000000000005b3256965e7c3cf26e11fcaf296dfc8807c01073000000000000000000000000baf2127b49fc93cbca6269fade0f7f31df4c88a70000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002ee000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006270258300000000000000000000000000000000000000000000000000000000000000005db1af206efbdda5843b2d1fdffb0cb9ae824cf53c269797a1b85a3af4bdd8b800000000000000000000000000000000000000000000000000000000000002ee000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000062701545000000000000000000000000000000000000000000000000000000006278c3782b2eecf91c86cc457efc8007cedff6b0b8bf6d95f0147c79f60349b8d432d9930000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000006a000000000000000000000000000000000000000000000000000000000000007c000000000000000000000000000000000000000000000000000000000000008e00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000b200000000000000000000000000000000000000000000000000000000000000b20000000000000000000000000000000000000000000000000000000000000001b000000000000000000000000000000000000000000000000000000000000001b85522245dd88789d2e18278ad3da5ed2ca128ad863c573ed83248dfe4e2dee8e7940551a71ce90e55abc324588d14e326d043dab12f089c56413a41c5bf94de985522245dd88789d2e18278ad3da5ed2ca128ad863c573ed83248dfe4e2dee8e7940551a71ce90e55abc324588d14e326d043dab12f089c56413a41c5bf94de9000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e4fb16a59500000000000000000000000000000000000000000000000000000000000000000000000000000000000000009b00ccfda8368fc0955542ff3dac45824129113b00000000000000000000000034d85c9cdeb23fa97cb08333b511ac86e1c4e2580000000000000000000000000000000000000000000000000000000000001747000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e4fb16a5950000000000000000000000002e73e34c50607b8fdff70323fa3279f41a522957000000000000000000000000000000000000000000000000000000000000000000000000000000000000000034d85c9cdeb23fa97cb08333b511ac86e1c4e2580000000000000000000000000000000000000000000000000000000000001747000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e400000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e4000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";

// Output
const calldataBuy = "0xfb16a59500000000000000000000000000000000000000000000000000000000000000000000000000000000000000009b00ccfda8368fc0955542ff3dac45824129113b00000000000000000000000034d85c9cdeb23fa97cb08333b511ac86e1c4e2580000000000000000000000000000000000000000000000000000000000001747000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000000";
const calldataSell = "0xfb16a5950000000000000000000000002e73e34c50607b8fdff70323fa3279f41a522957000000000000000000000000000000000000000000000000000000000000000000000000000000000000000034d85c9cdeb23fa97cb08333b511ac86e1c4e2580000000000000000000000000000000000000000000000000000000000001747000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000000";
const feeMethodsSidesKindsHowToCalls = [
	1, 0, 0, 1,
	1, 1, 0, 1
]
const rssMetadata = [
	'0x85522245dd88789d2e18278ad3da5ed2ca128ad863c573ed83248dfe4e2dee8e',
	'0x7940551a71ce90e55abc324588d14e326d043dab12f089c56413a41c5bf94de9',
	'0x85522245dd88789d2e18278ad3da5ed2ca128ad863c573ed83248dfe4e2dee8e',
	'0x7940551a71ce90e55abc324588d14e326d043dab12f089c56413a41c5bf94de9',
	'0x0000000000000000000000000000000000000000000000000000000000000000'
]
const addresses = [
	'0x7f268357A8c2552623316e2562D90e642bB538E5',
	'0x9b00CcFdA8368fC0955542fF3daC45824129113B',
	'0x2E73E34C50607B8FdFF70323Fa3279f41a522957',
	'0x0000000000000000000000000000000000000000',
	'0xBAf2127B49fC93CbcA6269FAdE0F7F31dF4c88a7',
	'0x0000000000000000000000000000000000000000',
	'0x0000000000000000000000000000000000000000',
	'0x7f268357A8c2552623316e2562D90e642bB538E5',
	'0x2E73E34C50607B8FdFF70323Fa3279f41a522957',
	'0x0000000000000000000000000000000000000000',
	'0x5b3256965e7C3cF26E11FCAf296DfC8807C01073',
	'0xBAf2127B49fC93CbcA6269FAdE0F7F31dF4c88a7',
	'0x0000000000000000000000000000000000000000',
	'0x0000000000000000000000000000000000000000'
];


const emptyData = "0x";

const transferEventTopics = [
	"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
	"0x0000000000000000000000002e73e34c50607b8fdff70323fa3279f41a522957",
	"0x0000000000000000000000009b00ccfda8368fc0955542ff3dac45824129113b",
	"0x0000000000000000000000000000000000000000000000000000000000001747"
];

const approvalEventTopics = [
	"0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
	"0x0000000000000000000000002e73e34c50607b8fdff70323fa3279f41a522957",
	"0x0000000000000000000000000000000000000000000000000000000000000000",
	"0x0000000000000000000000000000000000000000000000000000000000001747"
];

const ordersMatchedData = "0x00000000000000000000000000000000000000000000000000000000000000004444001a5b46149a3f7bac1d595461948c376c849bf853c4991ec382efdd77d6000000000000000000000000000000000000000000000000de0b6b3a76400000";
const ordersMatchedTopics = [
	"0xc4109843e0b7d514e4c093114b863f8e7d8d9a458c372cd51bfe526b588006c9",
	"0x0000000000000000000000002e73e34c50607b8fdff70323fa3279f41a522957",
	"0x0000000000000000000000009b00ccfda8368fc0955542ff3dac45824129113b",
	"0x0000000000000000000000000000000000000000000000000000000000000000"
]