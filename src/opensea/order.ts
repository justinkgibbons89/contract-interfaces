export type AtomicMatchTransaction = {
	buy: Order,
	sell: Order
	value: number
}

export type Order = {
	exchange: string,
	maker: string,
	taker: string,
	feeRecipient: string,
	target: string,
	staticTarget: string,
	howToCall: HowToCall,
	saleKind: SaleKind,
	saleSide: SaleSide,
	feeMethod: FeeMethod,
	basePrice: number,
	auctionExtra: number,
	paymentToken: string,
	expirationTime: number | string,
	listingTime: number | string,
	makerProtocolFee: number,
	takerProtocolFee: number,
	makerRelayerFee: string,
	takerRelayerFee: number,
	calldataBuy: string,
	calldataSell: string,
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