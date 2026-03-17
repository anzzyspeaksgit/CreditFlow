// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/CreditPool.sol";
import "../src/CreditToken.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "mUSDC") {
        _mint(msg.sender, 1000000 * 10 ** 18);
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract CreditPoolTest is Test {
    CreditPool public pool;
    CreditToken public poolToken;
    MockUSDC public usdc;

    address lender1 = address(0x1);
    address borrower1 = address(0x2);

    function setUp() public {
        usdc = new MockUSDC();
        poolToken = new CreditToken();
        pool = new CreditPool(address(usdc), address(poolToken));

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

    function testBorrow() public {
        vm.prank(lender1);
        pool.deposit(1000 * 10 ** 18);

        pool.approveBorrower(borrower1, true);

        vm.prank(borrower1);
        pool.borrow(500 * 10 ** 18);

        assertEq(pool.totalBorrowed(), 500 * 10 ** 18);
        assertEq(usdc.balanceOf(borrower1), 500 * 10 ** 18);
    }
}
