# CreditFlow - Institutional Private Credit Protocol

CreditFlow is a decentralized private credit protocol built on BNB Chain for the RWA Demo Day. It enables institutional-grade lending on-chain, where liquidity providers can earn sustainable yields backed by real-world business activities, decoupled from crypto market volatility.

## Core Features

- **Credit Pool Token (CFLOW)**: ERC20 representing pool shares that automatically accrue interest.
- **Risk-Tiered Lending Pools**: Senior and Mezzanine tranches for tailored risk profiles.
- **Borrower Verification**: Strict KYC/AML workflows before businesses can access credit lines.
- **Institutional Dashboard**: Track TVL, active positions, accrued interest, and pool utilization.

## Tech Stack

- **Smart Contracts**: Solidity 0.8.20+, Foundry, OpenZeppelin
- **Frontend**: Next.js 14 (App Router), React, TailwindCSS, Framer Motion
- **Web3**: Wagmi, Viem, RainbowKit
- **Network**: BNB Chain Testnet

## Getting Started

### Smart Contracts

```bash
cd contracts
forge install
forge build
forge test
# Deploy to testnet
forge script script/Deploy.s.sol:DeployScript --rpc-url <RPC_URL> --private-key <PRIVATE_KEY> --broadcast
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to interact with the protocol.

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for a detailed overview of the protocol architecture.
