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

export const ERC20ABI = [
	// Optional Methods
	"function name()",
	"function symbol()",
	"function decimals()",

	// Required Methods
	"function totalSupply()",
	"function balanceOf(address owner)",
	"function transfer(address to, uint256 value)",
	"function transferFrom(address from, address to, uint256 value)",
	"function approve(address spender, uint256 amount)",
	"function allowance(address owner, address spender)",

	// Required Events
	"event Transfer(address indexed from, address indexed to, uint256 value)",
	"event Approval(address indexed owner, address indexed spender, uint256 value)"
]

export const ERC1151ABI = [
	// Events
	"event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)",
	"event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values)",
	"event ApprovalForAll(address indexed operator, address indexed owner, bool approved)",
	"event(string value, uint256 indexed id)",

	// Methods
	"function safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes calldata data)",
	"function safeBatchTransferFrom(address from, address to, uint256[] calldata ids, uint256[] calldata values, bytes calldata data)",
	"function balanceOf(address owner, uint256 id)",
	"function balanceOfBatch(address[] calldata owners, uint256[] calldata ids)",
	"function setAppprovalForAll(address operator, bool approved)",
	"function isApprovedForAll(address owner, address operator)"

]

export const OpenSeaExchangeAddress = "0x7f268357A8c2552623316e2562D90e642bB538E5";