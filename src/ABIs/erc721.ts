export const ERC721ABI = [
	// Events
	"event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
	"event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
	"event ApprovalForAll(address indexed owner, address indexed operator, bool approved)",

	// Methods
	"function safeTransferFrom(address from, address to, uint256 tokenId)",
	"function transferFrom(address from, address to, uint256 tokenId)",
	"function setApprovalForAll(address operator, bool approved)",
	"function approve(address approved, uint256 tokenId)",
	"function ownerOf(uint256 tokenId)",
	"function balanceOf(address owner)"
]
