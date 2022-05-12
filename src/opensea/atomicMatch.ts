import { convertHexGweiToEth } from "../utils/formatting";
import { BigNumber, ethers } from "ethers";
import { AtomicMatchTransaction, FeeMethod, HowToCall, Order, SaleKind, SaleSide } from "./order";
import wyvernABI from './ABIs/wyvernExchangeABI.json';

/* ----------------------------------------------------
|              Wyvern Exchange Decoding                |
|   Decoding methods for Wyvern Exchange v2 contract   |
|   transactions as used by OpenSea.                   |
----------------------------------------------------- */

/// Returns the sale side from a boolean integer.
const saleSide = (int: number) => {
	return int as SaleSide;
}

/// Returns the sale kind from a boolean integer.
const saleKind = (int: number) => {
	return int as SaleKind;
}

/// Returns a fee method from a boolean integer. Usually will be "Split Fee".
const feeMethod = (int: number) => {
	return int as FeeMethod;
}

// Returns a calling method from a boolean integer.
const howToCall = (int: number) => {
	return int as HowToCall;
}

// Returns a timestamp from a hex value.
export const timeFromHex = (hex: string) => {
	const bigNumber = BigNumber.from(hex);
	const int = bigNumber.toNumber();
	return (int == 0) ? "Never" : int;
}

// Just a plain number.
export const numberFromHex = (hex: string) => {
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
	const ifc = new ethers.utils.Interface(wyvernABI)
	const parsedTransaction = ifc.parseTransaction({ data })
	return parsedTransaction;
}

// Parses an atomicMatch_ transaction and returns a structured description.
export const parseAtomicMatch = ({ args, value }) => {
	const val = convertHexGweiToEth(value._hex);

	let buy: Order = {
		exchange: args.addrs[0],
		calldataBuy: args.calldataBuy,
		calldataSell: args.calldataSell,
		maker: args.addrs[1],
		taker: args.addrs[2],
		makerRelayerFee: feeDescription(args.uints[0], value),
		takerRelayerFee: percentageFromBasisHex(args.uints[1]),
		makerProtocolFee: percentageFromBasisHex(args.uints[2]),
		takerProtocolFee: percentageFromBasisHex(args.uints[3]),
		feeRecipient: args.addrs[3],
		feeMethod: feeMethod(args.feeMethodsSidesKindsHowToCalls[0]),
		saleSide: saleSide(args.feeMethodsSidesKindsHowToCalls[1]),
		saleKind: saleKind(args.feeMethodsSidesKindsHowToCalls[2]),
		target: args.addrs[4],
		howToCall: howToCall(args.feeMethodsSidesKindsHowToCalls[3]),
		staticTarget: args.addrs[5],
		paymentToken: args.addrs[6],
		basePrice: convertHexGweiToEth(args.uints[4]),
		auctionExtra: convertHexGweiToEth(args.uints[5]),
		listingTime: timeFromHex(args.uints[6]),
		expirationTime: timeFromHex(args.uints[7]),
		salt: 10,//txn.data.args.uints.input[8]
	}

	const sell: Order = {
		calldataBuy: args.calldataBuy,
		calldataSell: args.calldataSell,
		exchange: args.addrs[7],
		maker: args.addrs[8],
		taker: args.addrs[9],
		makerRelayerFee: feeDescription(args.uints[9], value),
		takerRelayerFee: convertHexGweiToEth(args.uints[10]),
		makerProtocolFee: convertHexGweiToEth(args.uints[11]),
		takerProtocolFee: convertHexGweiToEth(args.uints[12]),
		feeRecipient: args.addrs[10],
		feeMethod: feeMethod(args.feeMethodsSidesKindsHowToCalls[4]),
		saleSide: saleSide(args.feeMethodsSidesKindsHowToCalls[5]),
		saleKind: saleKind(args.feeMethodsSidesKindsHowToCalls[6]),
		target: args.addrs[11],
		howToCall: howToCall(args.feeMethodsSidesKindsHowToCalls[7]),
		staticTarget: args.addrs[12],
		paymentToken: args.addrs[13],
		basePrice: convertHexGweiToEth(args.uints[13]),
		auctionExtra: convertHexGweiToEth(args.uints[14]),
		listingTime: timeFromHex(args.uints[15]),
		expirationTime: timeFromHex(args.uints[16]),
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

	return {
		buy: buy,
		sell: sell,
		value: val
	} as AtomicMatchTransaction
}

export const interpretAtomicMatch = (hex: string) => {
	const decoded = decodeAtomicMatch(hex);
	const parsed = parseAtomicMatch(decoded);
	return parsed;
}