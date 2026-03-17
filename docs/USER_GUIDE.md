# CreditFlow User Guide (Demo Day)

Welcome to the CreditFlow demo! This guide will walk you through the end-to-end lifecycle of our institutional private credit protocol.

## Prerequisites
1. **Wallet**: MetaMask, Rainbow, or any WalletConnect-compatible wallet.
2. **Network**: Switch your wallet to the **BNB Smart Chain Testnet** (Chain ID: 97).
3. **Gas**: You will need some testnet BNB for gas fees. You can get this from the official [BNB Smart Chain Faucet](https://testnet.bnbchain.org/faucet-smart).

## 1. The Lender Experience (Depositing)

As a DeFi user, you want to earn sustainable, real-world yields.

1. Navigate to the **Lending Pools** page via the top navigation bar.
2. Click on **Deposit** for the "SME Invoice Factoring" pool.
3. **Mint Test USDC**: On the right panel, click "Mint 10,000 Test USDC" to receive mock stablecoins for the demo. Confirm the transaction in your wallet.
4. **Approve & Deposit**: 
   - Enter an amount (e.g., `1000`).
   - Click **Approve USDC** and confirm the spending cap in your wallet.
   - Once approved, the button will change to **Deposit Funds**. Click it and confirm.
5. You have successfully supplied liquidity and minted `CFLOW` pool shares!
6. Navigate to the **Dashboard** to see your active positions, total supplied value, and global pool utilization metrics.

## 2. The Borrower Experience (Credit Lines)

Institutional borrowers need capital to fund real-world operations (like invoice factoring or real estate bridging).

1. Navigate to the **Borrow** page.
2. **Unverified View**: If your wallet is not whitelisted, you will see a multi-step KYC and documentation upload funnel.
3. **Verified View**: If your wallet is whitelisted by the protocol admin (Risk Committee), you bypass the application and directly see the **Active Credit Line** dashboard.
4. **Drawdown Funds**: Enter an amount to borrow against your credit limit and click **Drawdown Funds**. You will receive USDC directly into your wallet.
5. **Repay & Accrue Interest**: Enter a principal repayment amount. The protocol automatically calculates and adds a 5% interest fee. Click **Repay & Accrue Interest** to return the capital to the pool.

## 3. The Admin Experience (Risk Committee)

The protocol relies on off-chain legal frameworks combined with on-chain access controls to verify borrowers.

1. Navigate to the **Dashboard** and click on **Risk Admin** in the top right.
2. Here, you can view the total number of Verified Borrowers and Pending Applications.
3. In the **Borrower Management** table, click **Approve Borrower** on a pending application (like Acme Corp).
4. Confirm the transaction. The smart contract's `approveBorrower` function will add their address to the on-chain whitelist, granting them instant access to the Borrowing Dashboard.

## 4. Frictionless Yield Accrual

When the borrower repays their loan with the 5% interest fee, the total USDC balance of the pool increases *without* minting any new `CFLOW` shares. 
- Go back to the **Lender Dashboard**.
- You will notice that your **Total Supplied** value has increased, reflecting your proportional share of the newly accrued interest. 
- You can click **Withdraw All** to burn your shares and claim your original principal plus the real-world yield.
