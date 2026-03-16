// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/CreditPool.sol";
import "../src/CreditToken.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "mUSDC") {
        _mint(msg.sender, 10000000 * 10 ** 18);
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract IntegrationTest is Test {
    CreditPool public pool;
    CreditToken public poolToken;
    MockUSDC public usdc;

    address lender1 = address(0x1);
    address lender2 = address(0x2);
    address borrower = address(0x3);

    function setUp() public {
        usdc = new MockUSDC();
        poolToken = new CreditToken();
        pool = new CreditPool(address(usdc), address(poolToken));
        
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
    }

    function testFullLifecycle() public {
        // 1. Lenders deposit
        vm.prank(lender1);
        pool.deposit(1000 * 10 ** 18);
        
        vm.prank(lender2);
        pool.deposit(1000 * 10 ** 18);
        
        assertEq(pool.totalDeposits(), 2000 * 10 ** 18);
        assertEq(poolToken.balanceOf(lender1), 1000 * 10 ** 18);
        assertEq(poolToken.balanceOf(lender2), 1000 * 10 ** 18);

        // 2. Borrower borrows
        vm.prank(borrower);
        pool.borrow(1500 * 10 ** 18);
        
        assertEq(pool.totalBorrowed(), 1500 * 10 ** 18);
        assertEq(usdc.balanceOf(borrower), 2500 * 10 ** 18); // 1000 initial + 1500 borrowed

        // 3. Borrower repays with interest (say 100 USDC interest)
        // Note: The simple repay function in CreditPool reduces totalBorrowed.
        // If they transfer more USDC directly to the pool to simulate interest accrued,
        // it increases the pool's balance but totalDeposits remains the same until someone deposits/withdraws.
        // Let's test the simple repay logic first.
        vm.prank(borrower);
        pool.repay(1500 * 10 ** 18);
        assertEq(pool.totalBorrowed(), 0);

        // 4. Lenders withdraw
        vm.prank(lender1);
        pool.withdraw(1000 * 10 ** 18);
        
        assertEq(usdc.balanceOf(lender1), 10000 * 10 ** 18); // Full return
        
        vm.prank(lender2);
        pool.withdraw(1000 * 10 ** 18);
        
        assertEq(usdc.balanceOf(lender2), 10000 * 10 ** 18); // Full return
    }
}
