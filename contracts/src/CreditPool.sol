// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./CreditToken.sol";

contract CreditPool is Ownable, ReentrancyGuard {
    IERC20 public usdc;
    CreditToken public poolToken;

    uint256 public totalDeposits;
    uint256 public totalBorrowed;

    mapping(address => bool) public approvedBorrowers;

    event Deposited(address indexed lender, uint256 amount, uint256 shares);
    event Withdrawn(address indexed lender, uint256 amount, uint256 shares);
    event Borrowed(address indexed borrower, uint256 amount);
    event Repaid(address indexed borrower, uint256 amount);

    constructor(address _usdc, address _poolToken) Ownable(msg.sender) {
        usdc = IERC20(_usdc);
        poolToken = CreditToken(_poolToken);
    }

    function approveBorrower(address borrower, bool status) external onlyOwner {
        approvedBorrowers[borrower] = status;
    }

    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        usdc.transferFrom(msg.sender, address(this), amount);

        uint256 shares = amount; // 1:1 for simplicity in test
        if (poolToken.totalSupply() > 0 && totalDeposits > 0) {
            shares = (amount * poolToken.totalSupply()) / totalDeposits;
        }

        totalDeposits += amount;
        poolToken.mint(msg.sender, shares);

        emit Deposited(msg.sender, amount, shares);
    }

    function withdraw(uint256 shares) external nonReentrant {
        require(shares > 0, "Shares must be > 0");
        uint256 amount = (shares * totalDeposits) / poolToken.totalSupply();

        require(usdc.balanceOf(address(this)) >= amount, "Insufficient liquidity");

        poolToken.burn(msg.sender, shares);
        totalDeposits -= amount;
        usdc.transfer(msg.sender, amount);

        emit Withdrawn(msg.sender, amount, shares);
    }

    function borrow(uint256 amount) external nonReentrant {
        require(approvedBorrowers[msg.sender], "Not approved");
        require(usdc.balanceOf(address(this)) >= amount, "Insufficient liquidity");

        totalBorrowed += amount;
        usdc.transfer(msg.sender, amount);

        emit Borrowed(msg.sender, amount);
    }

    function repay(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        usdc.transferFrom(msg.sender, address(this), amount);

        totalBorrowed -= amount;
        // Simple un-accrued repay for now

        emit Repaid(msg.sender, amount);
    }
}
