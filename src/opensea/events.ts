export interface LogEvent {
	name: string,
	arguments: {},
}

export type ERC721Transfer = {
	name: string,
	arguments: {
		from: string,
		to: string,
		tokenId: number
	}
}

export type ERC721Approval = {
	name: string,
	arguments: {
		owner: string,
		approved: string,
		tokenId: number
	}
}

export type WyvernOrdersMatched = {
	name: string,
	arguments: {
		maker: string,
		taker: string,
		buyHash: string,
		sellHash: string,
		price: number
	}
}