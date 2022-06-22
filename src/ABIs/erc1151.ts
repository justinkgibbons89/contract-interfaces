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
