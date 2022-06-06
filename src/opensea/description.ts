import { ERC721Transfer } from "./events";
import { AtomicMatchBundle, TransactionBundle } from "./order"

export type SaleDescription = {
	price: number,
	buyer: string,
	seller: string,
	market: string,
	fee: string,
	collection: string,
	tokenId: number
}

export const describeTransaction = (txn: TransactionBundle) => {
	if (<AtomicMatchBundle>txn != null) {
		const desc = describeAtomicMatch(txn as AtomicMatchBundle);
		return desc
	} else {
		throw new Error('Transaction did not match the Atomic Match profile.')
	}
}

const describeAtomicMatch = (bundle: AtomicMatchBundle) => {
	const transfer = bundle.events.find(event => {
		return (event.name == "Transfer")
	}) as ERC721Transfer

	if (transfer == undefined) {
		console.log('no transfer event')
		throw new Error("No transfer event.")
	}

	return {
		price: bundle.txn.buy.basePrice,
		buyer: transfer.arguments.to,
		seller: transfer.arguments.from,
		market: bundle.txn.buy.exchange,
		fee: bundle.txn.buy.makerRelayerFee,
		collection: transfer.address,
		tokenId: transfer.arguments.tokenId
	} as SaleDescription
}