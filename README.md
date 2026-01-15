# AuRoom Protocol - Frontend

<div align="center">

![AuRoom Banner](https://img.shields.io/badge/AuRoom-Protocol-gold?style=for-the-badge&logo=ethereum&logoColor=white)

**From Rupiah to Yield-Bearing Gold**

[![Next.js](https://img.shields.io/badge/Next.js-16.1.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![wagmi](https://img.shields.io/badge/wagmi-2.19.5-purple?style=flat-square)](https://wagmi.sh/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)

[Live Demo](https://auroom-mantle-testnet.vercel.app) • [Smart Contracts](https://github.com/AuroomProtocol/auroom-mantle-sc) • [Backend](https://github.com/AuroomProtocol/auroom-mantle-be) • [Documentation](#-documentation)

</div>

---

## Live Demo

**[https://auroom-mantle-testnet.vercel.app](https://auroom-mantle-testnet.vercel.app)**

> **Testnet Only**: This demo runs on Mantle Sepolia testnet. Do not use real funds.

---

## Overview

**AuRoom** is a Real World Asset (RWA) protocol on Mantle that enables users to access Indonesian Rupiah (IDRX) liquidity using tokenized gold (XAUT) as collateral, and seamlessly redeem IDRX back to fiat currency through bank transfers.

### Why AuRoom?

```
┌────────────────────────────────────────────────────────────────┐
│                                                                 │
│   REGULAR DEX:                                                  │
│   XAUT ──→ IDRX ──→ Sell for cash (off-chain, complex)          │
│                                                                 │
│   AUROOM:                                                        │
│   XAUT ──→ Cash Loan ──→ IDRX ──→ Direct bank transfer      │
│                                                                 │
│   "Unlock liquidity from your gold. Instant. On-chain."         │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## Features

### Landing Page
- Protocol overview and value proposition
- Live protocol statistics (collateral, loans, prices)
- Educational content about RWA and tokenized gold
- Comparison: AuRoom vs Traditional DEX

### Cash Loan Page
- Borrow IDRX using XAUT collateral
- Flexible LTV options (30%, 40%, 50%)
- Instant liquidity without selling your gold
- Integrated bank details for redeem

### My Loans Page
- Track active loans and collateral
- View loan health and liquidation risk
- Repay loans to unlock collateral
- Transaction history

### IDRX Redeem Flow
- Burn IDRX tokens on-chain
- Direct bank transfer to Indonesian bank accounts
- Support for major banks (BCA, BNI, BRI, Mandiri)
- Real-time status tracking with reference number

### Swap Page
- Swap IDRX ↔ XAUT ↔ USDC seamlessly
- Real-time quotes from on-chain data
- Slippage protection
- Transaction status tracking

### Admin Page
- **Faucet**: Get test tokens (IDRX, USDC, XAUT)
- **Liquidity**: Add/remove liquidity to pools
- **Identity**: Manage user verification
- **Debug**: View balances, allowances, contract info

---

## Tech Stack

### Core
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.0 | React framework with App Router |
| React | 19.2.3 | UI library |
| TypeScript | 5.x | Type safety |

### Web3
| Technology | Version | Purpose |
|------------|---------|---------|
| wagmi | 2.19.5 | React hooks for Ethereum |
| viem | 2.x | Ethereum interactions |
| RainbowKit | 2.x | Wallet connection UI |
| @tanstack/react-query | 5.x | Data fetching & caching |

### UI/UX
| Technology | Version | Purpose |
|------------|---------|---------|
| Tailwind CSS | 4.x | Utility-first styling |
| Radix UI | Various | Accessible components |
| Lucide React | 0.562.0 | Icons |
| GSAP | 3.14.2 | Animations |
| Three.js | 0.182.0 | 3D graphics |
| Recharts | 2.15.4 | Charts |
| Sonner | 2.0.7 | Toast notifications |

---

## Project Structure

```
auroom-mantle-fe/
├── app/                      # Next.js App Router
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   ├── swap/page.tsx         # Swap page
│   ├── cash-loan/page.tsx    # Cash Loan page
│   ├── my-loans/page.tsx     # My Loans page
│   ├── verify/page.tsx       # Verification page
│   └── admin/page.tsx        # Admin helper page
├── components/
│   ├── ui/                   # Reusable UI components
│   ├── layout/               # Layout components
│   ├── landing/              # Landing page sections
│   ├── cash-loan/            # Cash Loan components
│   └── features/admin/       # Admin page components
├── hooks/                    # Custom React hooks
│   ├── useLoan.ts
│   ├── contracts/            # Contract interaction hooks
│   └── admin/                # Admin-specific hooks
├── lib/
│   ├── contracts/            # Contract addresses & ABIs
│   │   ├── mantle_addresses.ts # Mantle Sepolia addresses
│   │   ├── chains.ts         # Chain configuration
│   │   └── abis/             # Contract ABIs
│   ├── wagmi.ts              # Wagmi configuration
│   └── utils/                # Utility functions
├── providers/                # React context providers
└── public/                   # Static assets
```

---

## Getting Started

### Prerequisites

- Node.js 20.x or later
- pnpm (recommended) / npm / yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/AuroomProtocol/auroom-mantle-fe.git
cd auroom-mantle-fe

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env` file:

```env
# WalletConnect Project ID (get from https://cloud.walletconnect.com)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Contract Addresses (Mantle Sepolia)
MOCK_IDRX=0xf0C848387950609a3F97e3d67363C46562aD0e28
MOCK_USDC=0xc76AfD7BAd35e66A6146564DDc391C97300c642b
XAUT=0xab8c0a0a773356A0843567b89E6e4330FDa7B9D6
IDENTITY_REGISTRY=0x28532929e2A67Dba781391bA0f7663b0cADA655F
UNISWAP_FACTORY=0x55c3D72C2F35A157ee154Bb37B7dDC9be0132BBf
UNISWAP_ROUTER=0x7064Acd14aD0a4b75997C0CcBAD2C89DadA6df69
PAIR_IDRX_USDC=0x3d134aDD1BfCc62e68CfA98D6A8b5Bb0d511f815
PAIR_XAUT_USDC=0xD4a1Bd11386C0F2619A849044294296253a6369B
SWAP_ROUTER=0x8980c7477E091E06f34a418c9fc923D1df849734
BORROWING_PROTOCOL_V2=0xb38139e077621421eba724008bB33C10996E6435

# Network Configuration
NEXT_PUBLIC_EXPLORER_URL=https://sepolia.mantlescan.xyz

# IDRX API Configuration
IDRX_MODE=demo  # Use 'demo' for testing, 'production' for real API
```

---

## Contract Addresses

All contracts are deployed on **Mantle Sepolia Testnet** (Chain ID: 5003)

| Contract | Address |
|----------|---------|
| **Tokens** | |
| IDRX | `0xf0C848387950609a3F97e3d67363C46562aD0e28` |
| USDC | `0xc76AfD7BAd35e66A6146564DDc391C97300c642b` |
| XAUT (Gold) | `0xab8c0a0a773356A0843567b89E6e4330FDa7B9D6` |
| **Infrastructure** | |
| IdentityRegistry | `0x28532929e2A67Dba781391bA0f7663b0cADA655F` |
| UniswapV2Factory | `0x55c3D72C2F35A157ee154Bb37B7dDC9be0132BBf` |
| UniswapV2Router | `0x7064Acd14aD0a4b75997C0CcBAD2C89DadA6df69` |
| **Liquidity Pairs** | |
| IDRX/USDC Pair | `0x3d134aDD1BfCc62e68CfA98D6A8b5Bb0d511f815` |
| XAUT/USDC Pair | `0xD4a1Bd11386C0F2619A849044294296253a6369B` |
| **Core Protocol** | |
| SwapRouter | `0x8980c7477E091E06f34a418c9fc923D1df849734` |
| BorrowingProtocolV2 | `0xb38139e077621421eba724008bB33C10996E6435` |

> **Block Explorer**: [Mantle Sepolia Explorer](https://sepolia.mantlescan.xyz)

---

## How to Use

### 1. Connect Wallet

1. Click "Connect Wallet" button
2. Select your preferred wallet (MetaMask, Coinbase, etc.)
3. Switch to Mantle Sepolia network if prompted

### 2. Get Test Tokens

1. Go to [Admin Page](/admin)
2. Use the Faucet tab to mint test tokens:
   - IDRX (Indonesian Rupiah)
   - USDC
   - XAUT (Gold - requires verification)

### 3. Get Verified (Demo KYC)

1. Visit [Demo KYC Page](/demo-kyc)
2. Enter your wallet address
3. Submit for verification
4. Admin will approve (or self-approve in admin page)

### 4. Get a Cash Loan

1. Go to [Cash Loan Page](/cash-loan)
2. Enter desired loan amount in IDRX
3. Select LTV (30%, 40%, or 50%)
4. Review collateral required (in XAUT)
5. Approve XAUT if needed
6. Click "Borrow" and confirm transaction
7. Receive IDRX tokens instantly!

### 5. Enter Bank Details for Redeem

1. After borrowing, enter your Indonesian bank details:
   - Select bank (BCA, BNI, BRI, Mandiri)
   - Enter 10-12 digit account number
   - Enter account holder name
2. Click "Submit & Redeem"

### 6. Track Your Loans

1. Go to [My Loans Page](/my-loans)
2. View all active loans
3. Monitor collateral and health factor
4. Repay loans to unlock your XAUT collateral

### 7. Swap Tokens (Optional)

1. Go to [Swap Page](/swap)
2. Select tokens to swap (IDRX, USDC, XAUT)
3. Enter amount
4. Review quote and slippage
5. Click "Swap" and confirm

---

## Development

### Scripts

```bash
# Development server
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

---

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

---

## Security Notes

-  **Testnet Only**: This is a demo on Mantle Sepolia
-  **No Real Funds**: All tokens are mock/test tokens
-  **KYC Required**: Users must be verified to use XAUT
-  **Demo Mode**: IDRX redeem uses mock API by default
-  **Non-Custodial**: You always control your keys
-  **On-Chain Verification**: All burns are recorded on blockchain
-  **Slippage Protection**: Built into all swaps

---

## Roadmap

- [x] Landing page with protocol info
- [x] Swap functionality (IDRX ↔ XAUT ↔ USDC)
- [x] Cash Loan with collateral (BorrowingProtocolV2)
- [x] IDRX Redeem to bank accounts
- [x] My Loans tracking page
- [x] Admin helper tools
- [x] Demo mode for testing
- [x] Live protocol statistics
- [x] Mantle Sepolia deployment
- [] Real IDRX API integration (production mode)
- [] Transaction history improvements
- [] Mobile app (React Native)
- [] Mainnet deployment on Mantle

---

## Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **Mantle** - L2 Blockchain Infrastructure
- **IDRX.org** - Indonesian Rupiah stablecoin provider
- **RainbowKit** - Beautiful wallet connection
- **wagmi** - Excellent React hooks for Ethereum
- **Vercel** - Hosting platform
- **shadcn/ui** - UI component inspiration

---

<div align="center"> **Built on Mantle Sepolia**[Back to Top](#-auroom-protocol---frontend)

</div>
