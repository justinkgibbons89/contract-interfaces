import { convertHexGweiToEth } from "../utils/formatting";
import { BigNumber } from "ethers";

/* ----------------------------------------------------
|													   |
|				Wyvern Exchange Decoding			   |
|	Decoding methods for Wyvern Exchange v2 contract   |
|	transactions as used by OpenSea.				   |
|													   |
------------------------------------------------------ */


/// Returns the sale side from a boolean integer.
const saleSide = (int) => {
	return (int == 0) ? "Buy" : "Sell"
}

/// Returns the sale kind from a boolean integer.
const saleKind = (int) => {
	return (int == 0) ? "Fixed Price" : "Dutch Auction";
}

/// Returns a fee method from a boolean integer. Usually will be "Split Fee".
const feeMethod = (int) => {
	return (int == 0) ? "Protocol Fee" : "Split Fee";
}

// Returns a calling method from a boolean integer.
const howToCall = (int) => {
	return (int == 0) ? "Call" : "Delegate Call";
}

// Returns a timestamp from a hex value.
const timeFromHex = (hex) => {
	const bigNumber = BigNumber.from(hex);
	const int = bigNumber.toNumber();
	return (int == 0) ? "Never" : int;
}

// Just a plain number.
const numberFromHex = (hex) => {
	const bigNumber = BigNumber.from(hex);
	return bigNumber.toNumber();
}

// Maker and taker fees are denominated in basis points.
const percentageFromBasisHex = (hex) => {
	return (numberFromHex(hex) / 100);
}

// Returns a string describing the fee, as a percentage and as an ETH value.
const feeDescription = (hex, totalCost) => {
	const percent = percentageFromBasisHex(hex);
	const feeCost = totalCost / 100 * percent;
	return percent.toString() + "%" + " | " + feeCost + "E"
}

// Parses an atomicMatch_ transaction and returns a structured description.
export const parseAtomicMatch = (txn) => {
	const value = convertHexGweiToEth(txn.value._hex);

	const buyOrder = {
		exchange: txn.data.args.addrs.input[0],
		buyCalldata: txn.data.args.calldataBuy.input,
		sellCalldata: txn.data.args.calldataSell.input,
		maker: txn.data.args.addrs.input[1],
		taker: txn.data.args.addrs.input[2],
		makerRelayerFee: feeDescription(txn.data.args.uints.input[0], value),
		takerRelayerFee: percentageFromBasisHex(txn.data.args.uints.input[1]),
		makerProtocolFee: percentageFromBasisHex(txn.data.args.uints.input[2]),
		takerProtocolFee: percentageFromBasisHex(txn.data.args.uints.input[3]),
		feeRecipient: txn.data.args.addrs.input[3],
		feeMethod: feeMethod(txn.data.args.feeMethodsSidesKindsHowToCalls.input[0]),
		side: saleSide(txn.data.args.feeMethodsSidesKindsHowToCalls.input[1]),
		saleKind: saleKind(txn.data.args.feeMethodsSidesKindsHowToCalls.input[2]),
		target: txn.data.args.addrs.input[4],
		authenticatedProxy: howToCall(txn.data.args.feeMethodsSidesKindsHowToCalls.input[3]),
		staticTarget: txn.data.args.addrs.input[5],
		paymentToken: txn.data.args.addrs.input[6],
		basePrice: convertHexGweiToEth(txn.data.args.uints.input[4]),
		auctionExtra: convertHexGweiToEth(txn.data.args.uints.input[5]),
		listingTime: timeFromHex(txn.data.args.uints.input[6]),
		expirationTime: timeFromHex(txn.data.args.uints.input[7]),
		salt: 10,//txn.data.args.uints.input[8]
	}

	const sig1 = {
		v: txn.data.args.vs.input[0],
		r: txn.data.args.rssMetadata.input[0],
		s: txn.data.args.rssMetadata.input[1]
	}

	const sig2 = {
		v: txn.data.args.vs.input[1],
		r: txn.data.args.rssMetadata.input[2],
		s: txn.data.args.rssMetadata.input[3]
	}

	const sellOrder = {
		buyCalldata: txn.data.args.calldataBuy.input,
		sellCalldata: txn.data.args.calldataSell.input,
		exchange: txn.data.args.addrs.input[7],
		maker: txn.data.args.addrs.input[8],
		taker: txn.data.args.addrs.input[9],
		makerRelayerFee: convertHexGweiToEth(txn.data.args.uints.input[9]),
		takerRelayerFee: convertHexGweiToEth(txn.data.args.uints.input[10]),
		makerProtocolFee: convertHexGweiToEth(txn.data.args.uints.input[11]),
		takerProtocolFee: convertHexGweiToEth(txn.data.args.uints.input[12]),
		feeRecipient: txn.data.args.addrs.input[10],
		feeMethod: feeMethod(txn.data.args.feeMethodsSidesKindsHowToCalls.input[4]),
		side: saleSide(txn.data.args.feeMethodsSidesKindsHowToCalls.input[5]),
		saleKind: saleKind(txn.data.args.feeMethodsSidesKindsHowToCalls.input[6]),
		target: txn.data.args.addrs.input[11],
		authenticatedProxy: howToCall(txn.data.args.feeMethodsSidesKindsHowToCalls.input[7]),
		staticTarget: txn.data.args.addrs.input[12],
		paymentToken: txn.data.args.addrs.input[13],
		basePrice: convertHexGweiToEth(txn.data.args.uints.input[13]),
		auctionExtra: convertHexGweiToEth(txn.data.args.uints.input[14]),
		listingTime: timeFromHex(txn.data.args.uints.input[15]),
		expirationTime: timeFromHex(txn.data.args.uints.input[16]),
		salt: 10,//txn.data.args.uints.input[8]
	}

	const fullOrder = {
		value: value,
		buyOrder: buyOrder,
		sellOrder: sellOrder,
		sig1: sig1,
		sig2: sig2
	}

	return fullOrder;
}