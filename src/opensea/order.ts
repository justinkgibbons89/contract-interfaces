import { Event } from "./events"

export interface TransactionBundle {
	txn: Transaction
	events: Event[]
}

export type AtomicMatchBundle = {
	txn: AtomicMatchTransaction
	events: Event[]
}

export interface Transaction {
	value: number
}

export type AtomicMatchTransaction = {
	// The buy order.
	buy: Order,
	// The sell order.
	sell: Order
	// The total value of the transaction.
	value: number
}

export type Order = {
	// The address of the exchange contract. (Should be OpenSea v2)
	exchange: string,
	// The maker who proposed this order.
	maker: string,
	// The take who is accepting this order.
	taker: string,
	// The recipient of fees. (Should be OpenSea wallet)
	feeRecipient: string,
	// ??
	target: string,
	staticTarget: string,
	/// The method with which the proxy contract should be called.
	howToCall: HowToCall,
	// Fixed price or ductch auction.
	saleKind: SaleKind,
	// Buy or sell.
	saleSide: SaleSide,
	// Protocol fee or split fee.
	feeMethod: FeeMethod,
	// The price of the transaction for the taker (fees included).
	basePrice: number,
	// ??
	auctionExtra: number,
	// The token used for payment (0x00 means Ether. Othe tokens will have an ERC-20 address.)
	paymentToken: string,
	// The timestamp for when this order expires, if any.
	expirationTime: number | string,
	// The timestamp for when this order was listed.
	listingTime: number | string,
	// The protocol fee paid by the maker.
	makerProtocolFee: number,
	// The protocol fee paid by the taker.
	takerProtocolFee: number,
	// The relayer fee paid by the maker.
	makerRelayerFee: string,
	// The realyer fee paid by the taker.
	takerRelayerFee: number,
	// Encoded calldata.
	calldataBuy: string,
	// Encoded calldata.
	calldataSell: string,
	// RNG.
	salt: number
}

export enum SaleSide {
	Buy = 0,
	Sell = 1
}

export enum SaleKind {
	FixedPrice = 0,
	DutchAuction = 1
}

export enum HowToCall {
	Call = 0,
	DelegateCall = 1
}

export enum FeeMethod {
	ProtocolFee = 0,
	SplitFee = 1
}