// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./CreditToken.sol";

contract CreditPool is Ownable, ReentrancyGuard {
    IERC20 public usdc;
    CreditToken public poolToken;

    uint256 public totalBorrowed;

    mapping(address => bool) public approvedBorrowers;

    event Deposited(address indexed lender, uint256 amount, uint256 shares);
    event Withdrawn(address indexed lender, uint256 amount, uint256 shares);
    event Borrowed(address indexed borrower, uint256 amount);
    event Repaid(address indexed borrower, uint256 principal, uint256 interest);

    constructor(address _usdc, address _poolToken) Ownable(msg.sender) {
        usdc = IERC20(_usdc);
        poolToken = CreditToken(_poolToken);
    }

    function approveBorrower(address borrower, bool status) external onlyOwner {
        approvedBorrowers[borrower] = status;
    }

    /**
     * @dev Calculates the total value of the pool (available liquidity + outstanding loans).
     * This acts as the base for the share price. As interest is repaid into the pool,
     * the available liquidity increases without increasing total shares, driving up the share price.
     */
    function totalAssets() public view returns (uint256) {
        return usdc.balanceOf(address(this)) + totalBorrowed;
    }

    // Maintained for frontend compatibility
    function totalDeposits() public view returns (uint256) {
        return totalAssets();
    }

    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");

        uint256 _totalAssets = totalAssets();
        uint256 shares = amount; // 1:1 for first deposit
        
        if (poolToken.totalSupply() > 0 && _totalAssets > 0) {
            shares = (amount * poolToken.totalSupply()) / _totalAssets;
        }

        // Transfer after calculating shares to avoid including the new deposit in _totalAssets
        usdc.transferFrom(msg.sender, address(this), amount);
        poolToken.mint(msg.sender, shares);

        emit Deposited(msg.sender, amount, shares);
    }

    function withdraw(uint256 shares) external nonReentrant {
        require(shares > 0, "Shares must be > 0");
        
        uint256 amount = (shares * totalAssets()) / poolToken.totalSupply();
        require(usdc.balanceOf(address(this)) >= amount, "Insufficient liquidity");

        poolToken.burn(msg.sender, shares);
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

    function repay(uint256 principal, uint256 interest) external nonReentrant {
        require(principal > 0 || interest > 0, "Must repay something");
        
        uint256 totalRepay = principal + interest;
        usdc.transferFrom(msg.sender, address(this), totalRepay);

        if (principal > 0) {
            require(totalBorrowed >= principal, "Repaying more principal than borrowed");
            totalBorrowed -= principal;
        }

        emit Repaid(msg.sender, principal, interest);
    }
}
