import { convertHexGweiToEth } from "../utils/formatting";
import { BigNumber, ethers } from "ethers";
import abi from './abi.json';
/* ----------------------------------------------------
|													   |
|				Wyvern Exchange Decoding			   |
|	Decoding methods for Wyvern Exchange v2 contract   |
|	transactions as used by OpenSea.				   |
|													   |
------------------------------------------------------ */


/// Returns the sale side from a boolean integer.
const saleSide = (int: number) => {
	return (int == 0) ? "Buy" : "Sell"
}

/// Returns the sale kind from a boolean integer.
const saleKind = (int: number) => {
	return (int == 0) ? "Fixed Price" : "Dutch Auction";
}

/// Returns a fee method from a boolean integer. Usually will be "Split Fee".
const feeMethod = (int: number) => {
	return (int == 0) ? "Protocol Fee" : "Split Fee";
}

// Returns a calling method from a boolean integer.
const howToCall = (int: number) => {
	return (int == 0) ? "Call" : "Delegate Call";
}

// Returns a timestamp from a hex value.
const timeFromHex = (hex: string) => {
	const bigNumber = BigNumber.from(hex);
	const int = bigNumber.toNumber();
	return (int == 0) ? "Never" : int;
}

// Just a plain number.
const numberFromHex = (hex: string) => {
	const bigNumber = BigNumber.from(hex);
	return bigNumber.toNumber();
}

// Maker and taker fees are denominated in basis points.
const percentageFromBasisHex = (hex: string) => {
	return (numberFromHex(hex) / 100);
}

// Returns a string describing the fee, as a percentage and as an ETH value.
const feeDescription = (hex: string, totalCost: number) => {
	const percent = percentageFromBasisHex(hex);
	const feeCost = totalCost / 100 * percent;
	return percent.toString() + "%" + " | " + feeCost + "E"
}

export const decodeAtomicMatch = (data: string) => {
	const ifc = new ethers.utils.Interface(abi)
	const parsedTransaction = ifc.parseTransaction({ data })
	return parsedTransaction;
}

// Parses an atomicMatch_ transaction and returns a structured description.
export const parseAtomicMatch = ({ args, value }) => {
	const val = convertHexGweiToEth(value._hex);

	const buyOrder = {
		exchange: args.addrs[0],
		buyCalldata: args.calldataBuy,
		sellCalldata: args.calldataSell,
		maker: args.addrs[1],
		taker: args.addrs[2],
		makerRelayerFee: feeDescription(args.uints[0], value),
		takerRelayerFee: percentageFromBasisHex(args.uints[1]),
		makerProtocolFee: percentageFromBasisHex(args.uints[2]),
		takerProtocolFee: percentageFromBasisHex(args.uints[3]),
		feeRecipient: args.addrs[3],
		feeMethod: feeMethod(args.feeMethodsSidesKindsHowToCalls[0]),
		side: saleSide(args.feeMethodsSidesKindsHowToCalls[1]),
		saleKind: saleKind(args.feeMethodsSidesKindsHowToCalls[2]),
		target: args.addrs[4],
		authenticatedProxy: howToCall(args.feeMethodsSidesKindsHowToCalls[3]),
		staticTarget: args.addrs[5],
		paymentToken: args.addrs[6],
		basePrice: convertHexGweiToEth(args.uints[4]),
		auctionExtra: convertHexGweiToEth(args.uints[5]),
		listingTime: timeFromHex(args.uints[6]),
		expirationTime: timeFromHex(args.uints[7]),
		salt: 10,//txn.data.args.uints.input[8]
	}

	//const sig1 = {
	//	v: txn.data.args.vs.input[0],
	//	r: txn.data.args.rssMetadata.input[0],
	//	s: txn.data.args.rssMetadata.input[1]
	//}

	//const sig2 = {
	//	v: txn.data.args.vs.input[1],
	//	r: txn.data.args.rssMetadata.input[2],
	//	s: txn.data.args.rssMetadata.input[3]
	//}

	//const sellOrder = {
	//	buyCalldata: txn.data.args.calldataBuy.input,
	//	sellCalldata: txn.data.args.calldataSell.input,
	//	exchange: txn.data.args.addrs.input[7],
	//	maker: txn.data.args.addrs.input[8],
	//	taker: txn.data.args.addrs.input[9],
	//	makerRelayerFee: convertHexGweiToEth(txn.data.args.uints.input[9]),
	//	takerRelayerFee: convertHexGweiToEth(txn.data.args.uints.input[10]),
	//	makerProtocolFee: convertHexGweiToEth(txn.data.args.uints.input[11]),
	//	takerProtocolFee: convertHexGweiToEth(txn.data.args.uints.input[12]),
	//	feeRecipient: txn.data.args.addrs.input[10],
	//	feeMethod: feeMethod(txn.data.args.feeMethodsSidesKindsHowToCalls.input[4]),
	//	side: saleSide(txn.data.args.feeMethodsSidesKindsHowToCalls.input[5]),
	//	saleKind: saleKind(txn.data.args.feeMethodsSidesKindsHowToCalls.input[6]),
	//	target: txn.data.args.addrs.input[11],
	//	authenticatedProxy: howToCall(txn.data.args.feeMethodsSidesKindsHowToCalls.input[7]),
	//	staticTarget: txn.data.args.addrs.input[12],
	//	paymentToken: txn.data.args.addrs.input[13],
	//	basePrice: convertHexGweiToEth(txn.data.args.uints.input[13]),
	//	auctionExtra: convertHexGweiToEth(txn.data.args.uints.input[14]),
	//	listingTime: timeFromHex(txn.data.args.uints.input[15]),
	//	expirationTime: timeFromHex(txn.data.args.uints.input[16]),
	//	salt: 10,//txn.data.args.uints.input[8]
	//}

	const fullOrder = {
		value: val,
		buyOrder: buyOrder
		//sellOrder: sellOrder,
		//sig1: sig1,
		//sig2: sig2
	}

	return fullOrder;
}

export const interpretAtomicMatch = (hex: string) => {
	const decoded = decodeAtomicMatch(hex);
	const parsed = parseAtomicMatch(decoded);
	return parsed;
}