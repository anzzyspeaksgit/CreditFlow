// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CreditToken is ERC20, Ownable {
    address public pool;
    string public assetType;
    bool public requiresKYC;

    constructor() ERC20("Credit Pool Token", "CFLOW") Ownable(msg.sender) {
        assetType = "Private Credit";
        requiresKYC = true;
    }

    function setPool(address _pool) external onlyOwner {
        require(pool == address(0), "Pool already set");
        pool = _pool;
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == pool, "Only pool can mint");
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external {
        require(msg.sender == pool, "Only pool can burn");
        _burn(from, amount);
    }
}
