// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/CreditPool.sol";
import "../src/CreditToken.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../src/interfaces/AggregatorV3Interface.sol";

contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "mUSDC") {
        _mint(msg.sender, 1000000 * 10 ** 18);
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

    function decimals() external pure returns (uint8) {
        return 8;
    }

    function description() external pure returns (string memory) {
        return "Mock Oracle";
    }

    function version() external pure returns (uint256) {
        return 1;
    }

    function getRoundData(uint80) external view returns (uint80, int256, uint256, uint256, uint80) {
        return (1, price, block.timestamp, block.timestamp, 1);
    }

    function latestRoundData() external view returns (uint80, int256, uint256, uint256, uint80) {
        return (1, price, block.timestamp, block.timestamp, 1);
    }
}

contract CreditPoolTest is Test {
    CreditPool public pool;
    CreditToken public poolToken;
    MockUSDC public usdc;
    MockOracle public oracle;

    address lender1 = address(0x1);
    address borrower1 = address(0x2);

    function setUp() public {
        usdc = new MockUSDC();
        poolToken = new CreditToken();
        oracle = new MockOracle();
        pool = new CreditPool(address(usdc), address(poolToken), address(oracle));

        poolToken.setPool(address(pool));

        usdc.mint(lender1, 10000 * 10 ** 18);
        vm.prank(lender1);
        usdc.approve(address(pool), 10000 * 10 ** 18);
    }

    function testDeposit() public {
        vm.prank(lender1);
        pool.deposit(1000 * 10 ** 18);

        assertEq(pool.totalAssets(), 1000 * 10 ** 18);
        assertEq(poolToken.balanceOf(lender1), 1000 * 10 ** 18);
    }

    function testBorrowWithCollateral() public {
        vm.prank(lender1);
        pool.deposit(1000 * 10 ** 18);

        pool.approveBorrower(borrower1, true);

        // Borrower deposits 1 unit of collateral (worth $2000)
        vm.prank(borrower1);
        pool.depositCollateral(1 * 10 ** 18);

        // Can borrow up to 80% of $2000 = $1600
        // We borrow $500
        vm.prank(borrower1);
        pool.borrow(500 * 10 ** 18);

        assertEq(pool.totalBorrowed(), 500 * 10 ** 18);
        assertEq(usdc.balanceOf(borrower1), 500 * 10 ** 18);
    }

    function testBorrowInsufficientCollateralReverts() public {
        vm.prank(lender1);
        pool.deposit(1000 * 10 ** 18);

        pool.approveBorrower(borrower1, true);

        // Borrower deposits 0.1 unit of collateral (worth $200)
        vm.prank(borrower1);
        pool.depositCollateral(1 * 10 ** 17);

        // Cannot borrow $500 (80% of $200 is $160)
        vm.prank(borrower1);
        vm.expectRevert("Insufficient collateral");
        pool.borrow(500 * 10 ** 18);
    }
}
