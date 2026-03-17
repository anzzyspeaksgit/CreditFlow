// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/CreditPool.sol";
import "../src/CreditToken.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../src/interfaces/AggregatorV3Interface.sol";

// Mock USDC for testnet deployment
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

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy Mock USDC
        MockUSDC usdc = new MockUSDC();
        console.log("Mock USDC deployed at:", address(usdc));

        // 2. Deploy Mock Oracle
        MockOracle oracle = new MockOracle();
        console.log("Mock Oracle deployed at:", address(oracle));

        // 3. Deploy Credit Token
        CreditToken cflowToken = new CreditToken();
        console.log("CreditToken (CFLOW) deployed at:", address(cflowToken));

        // 4. Deploy Credit Pool
        CreditPool pool = new CreditPool(address(usdc), address(cflowToken), address(oracle));
        console.log("CreditPool deployed at:", address(pool));

        // 5. Setup permissions
        cflowToken.setPool(address(pool));
        console.log("CreditToken pool set to CreditPool");

        // Mint some test USDC to deployer to test deposit flow
        usdc.mint(vm.addr(deployerPrivateKey), 100000 * 10 ** 18);
        console.log("Minted 100,000 mUSDC to deployer");

        vm.stopBroadcast();
    }
}
