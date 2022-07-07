export const ERC20ABI = [
	// Optional Methods
	"function name() view returns (string)",
	"function symbol() view returns (string)",
	"function decimals() view returns (uint8)",

	// Required Methods
	"function totalSupply() view returns (uint256)",
	"function balanceOf(address owner) view returns (uint256)",
	"function transfer(address to, uint256 value)",
	"function transferFrom(address from, address to, uint256 value)",
	"function approve(address spender, uint256 amount)",
	"function allowance(address owner, address spender)",

	// Required Events
	"event Transfer(address indexed from, address indexed to, uint256 value)",
	"event Approval(address indexed owner, address indexed spender, uint256 value)"
]