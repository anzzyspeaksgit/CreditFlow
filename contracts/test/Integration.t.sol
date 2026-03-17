// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/CreditPool.sol";
import "../src/CreditToken.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../src/interfaces/AggregatorV3Interface.sol";

contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "mUSDC") {
        _mint(msg.sender, 10000000 * 10 ** 18);
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract MockOracle is AggregatorV3Interface {
    int256 public price = 2000 * 10 ** 8; // $2000 per unit (e.g. Gold or ETH)

    function setPrice(int256 _price) external {
        price = _price;
    }

    function decimals() external pure returns (uint8) { return 8; }
    function description() external pure returns (string memory) { return "Mock Oracle"; }
    function version() external pure returns (uint256) { return 1; }
    function getRoundData(uint80) external view returns (uint80, int256, uint256, uint256, uint80) {
        return (1, price, block.timestamp, block.timestamp, 1);
    }
    function latestRoundData() external view returns (uint80, int256, uint256, uint256, uint80) {
        return (1, price, block.timestamp, block.timestamp, 1);
    }
}

contract IntegrationTest is Test {
    CreditPool public pool;
    CreditToken public poolToken;
    MockUSDC public usdc;
    MockOracle public oracle;

    address lender1 = address(0x1);
    address lender2 = address(0x2);
    address borrower = address(0x3);

    function setUp() public {
        usdc = new MockUSDC();
        poolToken = new CreditToken();
        oracle = new MockOracle();
        pool = new CreditPool(address(usdc), address(poolToken), address(oracle));
        
        poolToken.setPool(address(pool));

        usdc.mint(lender1, 10000 * 10 ** 18);
        usdc.mint(lender2, 10000 * 10 ** 18);
        
        vm.prank(lender1);
        usdc.approve(address(pool), 10000 * 10 ** 18);
        
        vm.prank(lender2);
        usdc.approve(address(pool), 10000 * 10 ** 18);
        
        // Approve borrower
        pool.approveBorrower(borrower, true);
        
        usdc.mint(borrower, 1000 * 10 ** 18); // for interest
        vm.prank(borrower);
        usdc.approve(address(pool), type(uint256).max);

        // Deposit collateral to borrow 1500
        // Price is 2000, 1500 / 0.8 = 1875 value needed -> approx 0.94 units
        vm.prank(borrower);
        pool.depositCollateral(1 * 10 ** 18);
    }

    function testFullLifecycle() public {
        // 1. Lenders deposit
        vm.prank(lender1);
        pool.deposit(1000 * 10 ** 18);
        
        vm.prank(lender2);
        pool.deposit(1000 * 10 ** 18);
        
        assertEq(pool.totalAssets(), 2000 * 10 ** 18);
        assertEq(poolToken.balanceOf(lender1), 1000 * 10 ** 18);
        assertEq(poolToken.balanceOf(lender2), 1000 * 10 ** 18);

        // 2. Borrower borrows
        vm.prank(borrower);
        pool.borrow(1500 * 10 ** 18);
        
        assertEq(pool.totalBorrowed(), 1500 * 10 ** 18);
        assertEq(usdc.balanceOf(borrower), 2500 * 10 ** 18); // 1000 initial + 1500 borrowed

        // 3. Borrower repays with interest (100 USDC interest)
        vm.prank(borrower);
        pool.repay(1500 * 10 ** 18, 100 * 10 ** 18); // 1500 principal + 100 interest
        
        assertEq(pool.totalBorrowed(), 0);
        assertEq(pool.totalAssets(), 2100 * 10 ** 18); // 2000 initial + 100 interest

        // 4. Lenders withdraw
        // Since the pool gained 100 USDC interest without issuing new shares,
        // each of the 2000 shares is now worth 2100/2000 = 1.05 USDC.
        // Lender 1 withdraws 1000 shares = 1050 USDC.
        vm.prank(lender1);
        pool.withdraw(1000 * 10 ** 18);
        
        assertEq(usdc.balanceOf(lender1), 10050 * 10 ** 18); // 9000 remaining + 1050 returned
        
        vm.prank(lender2);
        pool.withdraw(1000 * 10 ** 18);
        
        assertEq(usdc.balanceOf(lender2), 10050 * 10 ** 18); // 9000 remaining + 1050 returned
        
        // Pool should be completely empty
        assertEq(usdc.balanceOf(address(pool)), 0);
        assertEq(poolToken.totalSupply(), 0);
    }
}
