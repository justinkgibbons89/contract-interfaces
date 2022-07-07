export * from "./opensea/atomicMatch.js";
export * from "./router.js";
export * from "./opensea/order.js"

import { ERC20 } from "./erc20/erc20Interface";
import { ethers } from "ethers";
import { OpenSeaExchangeAddress } from "./opensea/constants";
import { ERC721 } from "./erc721/erc721Interface.js";
import 'dotenv/config'

console.log('starting...')
const provider = new ethers.providers.EtherscanProvider(process.env.NETWORK, process.env.ALCHEMYKEY);
const X2Y2Address = "0x1E4EDE388cbc9F4b5c79681B7f94d36a11ABEBC9";
const OtherdeedAddress = "0x34d85c9CDeB23FA97cb08333b511ac86E1C4E258";

const main = async () => {
	const otherdeed = new ERC721(OtherdeedAddress, provider)
	console.log(await otherdeed.name())
	console.log(await otherdeed.symbol())

	const metadata = await otherdeed.metadata(4626)
	console.log(metadata);

	const image = await otherdeed.imageURL(4626)
	console.log(image);

	const attributes = await otherdeed.attributes(4626)
	console.log(attributes[0]);
}

main();