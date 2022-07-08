import { ethers } from "ethers";
import { stringFromHex } from "../opensea/atomicMatch.js";
import { ERC721ABI, ERC721Metadata } from './abi.js'
import fetch from "node-fetch"

// Describes an atttribute contained in NFT metadata.
interface NFTAttribute {
	trait_type: string,
	value: string | number
	display_type: string | null
}

// Describes the metadata of an NFT.
interface NFTMetadata {
	attributes: NFTAttribute[],
	image: string
}

// Describes the metadata of an ERC-721 contract that conforms to the ERC-721Metadata standard.
export class MetadataERC721 {

	name: string;
	symbol: string;
	decimals: string;

	constructor(name: string, symbol: string, decimals: string) {
		this.name = name;
		this.symbol = symbol;
		this.decimals = decimals;
	}
}

// An interface for an ERC-721 contract.
export class ERC721 {

	// The underlying contract.
	contract: ethers.Contract;

	// Gets the contract name.
	async name() {
		return await this.contract.name()
	}

	// Gets the contract symbol.
	async symbol() {
		return await this.contract.symbol()
	}

	// Gets the contract decimals constant.
	async decimals() {
		return await this.contract.decimals()
	}

	// Gets constants representing ERC-721 metadata for this contract. This includes name, symbol and decimals.
	async contractMetadata() {
		const name = await this.name();
		const symbol = await this.symbol();
		const bigNumber = await this.decimals();
		const decimals = stringFromHex(bigNumber._hex);
		return new MetadataERC721(name, symbol, decimals);
	}

	// Gets the owner of the identified token.
	async ownerOf(tokenId: number) {
		return await this.contract.ownerOf(tokenId)
	}

	// Gets the token balance of the given address.
	async balanceOf(address: string) {
		return await this.contract.balanceOf(address)
	}

	// Gets the metadata URI for the identified token.
	async tokenURI(tokenId: number) {
		return await this.contract.tokenURI(tokenId)
	}

	// Gets the metadata for the identified token.
	async tokenMetadata(tokenId: number) {
		const uri = await this.tokenURI(tokenId)
		const response = await fetch(uri)
		const data: any = await response.json()
		return data as NFTMetadata;
	}

	// Gets the image URL of the identified token.
	async imageURL(tokenId: number) {
		const metadata = await this.tokenMetadata(tokenId)
		return metadata.image
	}

	// Gets the attributes of the identified token.
	async attributes(tokenId: number) {
		const metadata = await this.tokenMetadata(tokenId)
		return metadata.attributes as NFTAttribute[]
	}

	constructor(address: string, provider: ethers.providers.Provider) {
		this.contract = new ethers.Contract(address, ERC721ABI.concat(ERC721Metadata), provider);
	}
}