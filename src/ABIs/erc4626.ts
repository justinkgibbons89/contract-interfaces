export const ERC4626ABI = [
	// Events
	"event Deposit(address indexed from, address indexed to, uint256 value)",
	"event Withdraw(address indexed owner, address indexed to, uint256 value)",

	// Methods
	"function deposit(address to, uint256 value)",
	"function withdraw(adderss to, uint256 value)",
	"function totalHoldings()",
	"function balanceOfUnderlying(address owner)",
	"function underlying()",
	"function totalSupply()",
	"function balanceOf(address owner)",
	"function redeem(address to, uint256 shares)",
	"function exchangeRate()",
	"function baseUnit()"
]
