export interface Event {
	address: string,
	name: string,
	arguments: any,
}

export type ERC721Transfer = {
	address: string,
	name: string,
	arguments: {
		from: string,
		to: string,
		tokenId: number
	}
}

export type ERC721Approval = {
	address: string,
	name: string,
	arguments: {
		owner: string,
		approved: string,
		tokenId: number
	}
}

export type WyvernOrdersMatched = {
	address: string,
	name: string,
	arguments: {
		maker: string,
		taker: string,
		buyHash: string,
		sellHash: string,
		price: number
	}
}