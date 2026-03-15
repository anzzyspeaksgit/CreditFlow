# CreditFlow Architecture

## Frontend
- **Next.js 14 App Router**: React framework for structure and routing
- **TailwindCSS**: Utility-first styling
- **Lucide React**: Iconography
- **Wagmi / viem**: Web3 hooks and Ethereum interaction
- **RainbowKit**: Wallet connection UI

## Smart Contracts
- **CreditPool.sol**: Core deposit/borrowing logic
- **CreditToken.sol**: ERC20 representing pool shares (inherits or aligns with `BaseRWA.sol`)
- **Foundry**: Compilation and testing framework
