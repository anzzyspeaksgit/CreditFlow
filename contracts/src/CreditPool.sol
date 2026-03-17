// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./CreditToken.sol";
import "./interfaces/AggregatorV3Interface.sol";

contract CreditPool is Ownable, ReentrancyGuard {
    IERC20 public usdc;
    CreditToken public poolToken;
    AggregatorV3Interface public priceFeed;

    uint256 public totalBorrowed;

    struct BorrowerInfo {
        bool isApproved;
        uint256 collateralAmount; // e.g. amount of RWA token
    }
    mapping(address => BorrowerInfo) public borrowers;

    event Deposited(address indexed lender, uint256 amount, uint256 shares);
    event Withdrawn(address indexed lender, uint256 amount, uint256 shares);
    event Borrowed(address indexed borrower, uint256 amount);
    event Repaid(address indexed borrower, uint256 principal, uint256 interest);
    event CollateralDeposited(address indexed borrower, uint256 amount);

    constructor(address _usdc, address _poolToken, address _priceFeed) Ownable(msg.sender) {
        usdc = IERC20(_usdc);
        poolToken = CreditToken(_poolToken);
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function approveBorrower(address borrower, bool status) external onlyOwner {
        borrowers[borrower].isApproved = status;
    }

    function depositCollateral(uint256 amount) external nonReentrant {
        require(borrowers[msg.sender].isApproved, "Not approved borrower");
        borrowers[msg.sender].collateralAmount += amount;
        emit CollateralDeposited(msg.sender, amount);
    }

    function getCollateralValue(address borrower) public view returns (uint256) {
        if (address(priceFeed) == address(0)) return 0;
        (, int256 price, , , ) = priceFeed.latestRoundData();
        require(price > 0, "Invalid oracle price");
        
        // Assuming price has 8 decimals (standard for USD pairs on Chainlink)
        // Collateral amount is assuming 18 decimals
        // Value in USDC (18 decimals) = collateralAmount * price / 10^8
        return (borrowers[borrower].collateralAmount * uint256(price)) / 1e8;
    }

    /**
     * @dev Calculates the total value of the pool (available liquidity + outstanding loans).
     */
    function totalAssets() public view returns (uint256) {
        return usdc.balanceOf(address(this)) + totalBorrowed;
    }

    function totalDeposits() public view returns (uint256) {
        return totalAssets();
    }

    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");

        uint256 _totalAssets = totalAssets();
        uint256 shares = amount; 
        
        if (poolToken.totalSupply() > 0 && _totalAssets > 0) {
            shares = (amount * poolToken.totalSupply()) / _totalAssets;
        }

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
        require(borrowers[msg.sender].isApproved, "Not approved");
        require(usdc.balanceOf(address(this)) >= amount, "Insufficient liquidity");
        
        if (address(priceFeed) != address(0)) {
            uint256 collateralValue = getCollateralValue(msg.sender);
            // Simple LTV check: Max borrow 80% of collateral value
            require(collateralValue * 80 / 100 >= amount, "Insufficient collateral");
        }

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
