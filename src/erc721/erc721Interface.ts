import { ethers } from "ethers";
import { stringFromHex } from "../opensea/atomicMatch.js";
import { ERC721ABI, ERC721Metadata } from "../ABIs/erc721.js";
import fetch from "node-fetch"

// An interface for an ERC-721 contract.
export class ERC721 {

	// The underlying contract.
	contract: ethers.Contract;

	// Contract methods
	async name() {
		return await this.contract.name()
	}

	async symbol() {
		return await this.contract.symbol()
	}

	async decimals() {
		return await this.contract.decimals()
	}

	async ownerOf(tokenId: number) {
		return await this.contract.ownerOf(tokenId)
	}

	async balanceOf(address: string) {
		return await this.contract.balanceOf(address)
	}

	async tokenURI(tokenId: number) {
		return await this.contract.tokenURI(tokenId)
	}

	async metadata(tokenId: number) {
		const uri = await this.tokenURI(tokenId)
		const response = await fetch(uri)
		const data: any = await response.json()
		return data as NFTMetadata;
	}

	async imageURL(tokenId: number) {
		const metadata = await this.metadata(tokenId)
		return metadata.image
	}

	async attributes(tokenId: number) {
		const metadata = await this.metadata(tokenId)
		return metadata.attributes as NFTAttribute[]
	}

	constructor(address: string, provider: ethers.providers.Provider) {
		this.contract = new ethers.Contract(address, ERC721ABI.concat(ERC721Metadata), provider);
	}
}

interface NFTAttribute {
	trait_type: string,
	value: string | number
	display_type: string | null
}

interface NFTMetadata {
	attributes: NFTAttribute[],
	image: string
}