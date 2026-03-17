# CreditFlow Interest Rate Model

The CreditFlow protocol utilizes an innovative, frictionless interest accrual model inspired by ERC-4626 Tokenized Vaults.

## Mathematical Foundation

Instead of keeping track of individual user balances and mapping them to a dynamic interest index, the protocol relies on the concept of **Shares** (`CFLOW`) and **Total Assets**.

### Core Variables

1. **Shares (`CFLOW`):** An ERC20 token minted when a lender deposits USDC.
2. **Total Assets:** The total value held by the pool, calculated as:
   `totalAssets = USDC Balance + Outstanding Borrowed Principal`

### Deposit Mechanics

When a lender deposits `D` amount of USDC:

- If `totalAssets == 0` (first deposit):
  `Shares Minted = D`
- If `totalAssets > 0`:
  `Shares Minted = D * (Total Shares / Total Assets)`

### Borrowing & Repayment

When an approved borrower draws down funds, the `USDC Balance` decreases and the `Outstanding Borrowed Principal` increases by the exact same amount. Thus, `totalAssets` remains strictly constant.

**Interest Accrual:**
When the borrower repays their loan, they repay the Principal `P` plus an Interest fee `I`.
- The `USDC Balance` increases by `P + I`.
- The `Outstanding Borrowed Principal` decreases by `P`.

The net change in `totalAssets` is exactly `+I`.

### Yield Realization

Because `totalAssets` has increased by `I` but no new `Shares` were minted, the value of each existing `Share` proportionally increases.

When a lender withdraws their `S` shares:
`USDC Returned = S * (Total Assets / Total Shares)`

This model allows for infinite numbers of lenders to instantly compound interest without a single loop or complex state update, reducing gas costs to O(1) for yield distribution.
