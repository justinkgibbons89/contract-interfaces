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