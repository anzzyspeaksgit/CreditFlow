// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/CreditPool.sol";
import "../src/CreditToken.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Mock USDC for testnet deployment
contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "mUSDC") {
        _mint(msg.sender, 10000000 * 10 ** 18);
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy Mock USDC
        MockUSDC usdc = new MockUSDC();
        console.log("Mock USDC deployed at:", address(usdc));

        // 2. Deploy Credit Token
        CreditToken cflowToken = new CreditToken();
        console.log("CreditToken (CFLOW) deployed at:", address(cflowToken));

        // 3. Deploy Credit Pool
        CreditPool pool = new CreditPool(address(usdc), address(cflowToken));
        console.log("CreditPool deployed at:", address(pool));

        // 4. Setup permissions
        cflowToken.setPool(address(pool));
        console.log("CreditToken pool set to CreditPool");

        // Mint some test USDC to deployer to test deposit flow
        usdc.mint(vm.addr(deployerPrivateKey), 100000 * 10 ** 18);
        console.log("Minted 100,000 mUSDC to deployer");

        vm.stopBroadcast();
    }
}
