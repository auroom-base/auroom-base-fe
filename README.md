# 🏆 AuRoom Protocol - Frontend

<div align="center">

![AuRoom Banner](https://img.shields.io/badge/AuRoom-Protocol-gold?style=for-the-badge&logo=ethereum&logoColor=white)

**From Rupiah to Yield-Bearing Gold**

[![Next.js](https://img.shields.io/badge/Next.js-16.1.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![wagmi](https://img.shields.io/badge/wagmi-2.19.5-purple?style=flat-square)](https://wagmi.sh/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)

[🌐 Live Demo](https://auroom-base-testnet.vercel.app) • [📜 Smart Contracts](https://github.com/AuroomProtocol/auroom-base-sc) • [🔧 Backend](https://github.com/AuroomProtocol/auroom-base-be) • [📖 Documentation](#-documentation)

</div>

---

## 🌐 Live Demo

**🔗 [https://auroom-base-testnet.vercel.app](https://auroom-base-testnet.vercel.app)**

> ⚠️ **Testnet Only**: This demo runs on Base Sepolia testnet. Do not use real funds.

---

## 📖 Overview

**AuRoom** is a Real World Asset (RWA) protocol on Base that enables users to access Indonesian Rupiah (IDRX) liquidity using tokenized gold (XAUT) as collateral, and seamlessly redeem IDRX back to fiat currency through bank transfers.

### Why AuRoom?

```
┌────────────────────────────────────────────────────────────────┐
│                                                                 │
│   REGULAR DEX:                                                  │
│   XAUT ──→ IDRX ──→ 🚀 Sell for cash (off-chain, complex)          │
│                                                                 │
│   AUROOM:                                                        │
│   XAUT ──→ Cash Loan ──→ IDRX ──→ 🏦 Direct bank transfer      │
│                                                                 │
│   "Unlock liquidity from your gold. Instant. On-chain."         │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

### 🏠 Landing Page
- Protocol overview and value proposition
- Live protocol statistics (collateral, loans, prices)
- Educational content about RWA and tokenized gold
- Comparison: AuRoom vs Traditional DEX

### 💰 Cash Loan Page
- Borrow IDRX using XAUT collateral
- Flexible LTV options (30%, 40%, 50%)
- Instant liquidity without selling your gold
- Integrated bank details for redeem

### 📊 My Loans Page
- Track active loans and collateral
- View loan health and liquidation risk
- Repay loans to unlock collateral
- Transaction history

### 💎 IDRX Redeem Flow
- Burn IDRX tokens on-chain
- Direct bank transfer to Indonesian bank accounts
- Support for major banks (BCA, BNI, BRI, Mandiri)
- Real-time status tracking with reference number

### 💱 Swap Page
- Swap IDRX ↔ XAUT ↔ USDC seamlessly
- Real-time quotes from on-chain data
- Slippage protection
- Transaction status tracking

### 🛠️ Admin Page
- **Faucet**: Get test tokens (IDRX, USDC, XAUT)
- **Liquidity**: Add/remove liquidity to pools
- **Identity**: Manage user verification
- **Debug**: View balances, allowances, contract info

---
## Architecture (5 Layers)

AuRoom is organized into 5 production layers used in the demo flow:

1. Frontend App (Next.js)
2. Smart Contracts (Base Sepolia)
3. Backend API (Next.js routes)
4. Tenderly (pre-flight simulation + traces)
5. Chainlink CRE Workflows (price feed + liquidation guardian)

```mermaid
graph TB
    subgraph L1["Layer 1 — Frontend App (Next.js 16)"]
        UI["UI: Landing · Cash Loan · My Loans · Redeem"]
        HOOKS["Wagmi Hooks: depositAndBorrow · repayAndWithdraw · KYC"]
        PREFLIGHT["Pre-flight UX: simulate before wallet signing"]
    end

    subgraph L2["Layer 2 — Smart Contracts (Base Sepolia 84532)"]
        BP["BorrowingProtocolCRE"]
        IR["IdentityRegistryV2"]
        XAUT["XAUT collateral token"]
        IDRX["IDRX stablecoin"]
    end

    subgraph L3["Layer 3 — Backend API (Next.js Routes)"]
        SIM_D["/api/simulate/deposit"]
        SIM_R["/api/simulate/repay"]
        KYC["/api/kyc/*"]
        REDEEM["/api/redeem/*"]
        FAUCET["/api/faucet/mint + /api/fund"]
        IDRX_API["IDRX Protocol API (bank settlement)"]
    end

    subgraph L4["Layer 4 — Tenderly"]
        T_SIM["REST Simulation API (network_id: 84532)"]
        T_DASH["Simulation Dashboard (saved traces)"]
    end

    subgraph L5["Layer 5 — Chainlink CRE Workflows"]
        CRE_PF["Gold Price Feed Workflow"]
        CRE_LG["Liquidation Guardian Workflow"]
    end

    UI --> HOOKS
    UI --> PREFLIGHT
    UI --> KYC
    UI --> REDEEM
    UI --> FAUCET

    HOOKS -->|"deposit/repay tx"| BP
    HOOKS -->|"getKycLevel"| IR
    HOOKS -->|"approve/balance"| XAUT
    BP -->|"mint/burn"| IDRX

    PREFLIGHT --> SIM_D
    PREFLIGHT --> SIM_R
    SIM_D -->|"POST /simulate"| T_SIM
    SIM_R -->|"POST /simulate"| T_SIM
    T_SIM -->|"trace output"| T_DASH

    REDEEM --> IDRX_API

    CRE_PF -->|"setXAUTPrice()"| BP
    CRE_LG -->|"liquidate(user)"| BP
```

### Detailed Architecture Diagrams

#### 1. Component Relationship Map

```mermaid
graph TB
    subgraph FE["Frontend (Next.js 16)"]
        UI["User Interface\nWallet Connect · Cash Loan · My Loans · Faucet"]
        HOOKS["Wagmi Hooks\nuseDepositAndBorrow · useRepay · useKYC"]
        PREFLIGHT["Pre-flight UI\nPreflightCard · useSimulateDeposit · useSimulateRepay"]
    end

    subgraph BE["Backend API (Next.js Routes)"]
        SIM_D["/api/simulate/deposit"]
        SIM_R["/api/simulate/repay"]
        KYC["/api/kyc/status\n/api/kyc/submit"]
        FAUCET["/api/faucet/mint"]
        FUND["/api/fund"]
    end

    subgraph SC["Smart Contracts (Base Sepolia 84532)"]
        BP["BorrowingProtocolCRE\n0x4a5a42..."]
        IR["IdentityRegistryV2\n0x655b16..."]
        XAUT["XAUT Token\n0x56EeDF..."]
        IDRX["IDRX Token\n0x998ceB..."]
    end

    subgraph TENDERLY["Tenderly"]
        T_SIM["REST Simulation API\napi.tenderly.co/simulate\nnetwork_id: 84532"]
        T_VTN["Virtual TestNet\nDev sandbox only"]
        T_DASH["Dashboard\nSimulation traces"]
    end

    subgraph CRE["Chainlink CRE Workflow"]
        CRE_CRON["Cron Trigger\nEvery 15 min"]
        CRE_PRICES["Price Aggregator\nBybit · OKX · Kraken\nmetals.dev · goldapi.io"]
        CRE_ORACLE["setXAUTPrice()\nWeighted median → on-chain"]
    end

    %% FE ↔ BE
    UI -->|"KYC check on connect"| KYC
    PREFLIGHT -->|"simulate before signing"| SIM_D
    PREFLIGHT -->|"simulate before signing"| SIM_R
    UI -->|"Mint 0.01 XAUT"| FAUCET
    UI -->|"Auto ETH top-up"| FUND

    %% FE ↔ SC (direct via wagmi)
    HOOKS -->|"depositAndBorrow()\nrepayAndWithdraw()"| BP
    HOOKS -->|"getKycLevel()"| IR
    HOOKS -->|"balanceOf() · approve()"| XAUT

    %% BE ↔ Tenderly
    SIM_D -->|"POST /simulate\nX-Access-Key"| T_SIM
    SIM_R -->|"POST /simulate\nX-Access-Key"| T_SIM
    T_SIM -->|"Reads real state"| SC
    T_SIM -->|"Saves trace"| T_DASH

    %% BE ↔ SC
    KYC -->|"getKycLevel()\nBase Sepolia RPC"| IR
    FAUCET -->|"XAUT.mint()\nadmin wallet"| XAUT
    FUND -->|"ETH transfer\nadmin wallet"| SC

    %% CRE ↔ SC
    CRE_CRON --> CRE_PRICES
    CRE_PRICES -->|"Weighted median"| CRE_ORACLE
    CRE_ORACLE -->|"setXAUTPrice()\non Base Sepolia"| BP

    %% SC internal
    BP -->|"transferFrom()"| XAUT
    BP -->|"mint() IDRX to user"| IDRX
    BP -->|"getKycLevel()"| IR

    style TENDERLY fill:#1a1a2e,stroke:#6366f1,color:#a5b4fc
    style CRE fill:#1a2e1a,stroke:#22c55e,color:#86efac
    style FE fill:#1e1a2e,stroke:#f59e0b,color:#fcd34d
    style BE fill:#1e2a1a,stroke:#64748b,color:#94a3b8
    style SC fill:#2e1a1a,stroke:#ef4444,color:#fca5a5
```

#### 2. Tenderly Integration Detail

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend
    participant API as /api/simulate/*
    participant T as Tenderly REST API
    participant Chain as Base Sepolia

    User->>FE: Enter loan amount
    FE->>FE: Debounce 600ms
    FE->>API: POST {from, collateralAmount, borrowAmount}
    
    API->>T: POST /simulate<br/>network_id: 84532<br/>X-Access-Key: ***
    T->>Chain: Read real state<br/>(approvals, KYC, balances)
    Chain-->>T: State snapshot
    T->>T: Run EVM simulation
    T-->>API: {status, gas_used, error_info}
    
    API-->>FE: {success, gasUsed, revertReason}
    FE->>User: PreflightCard green / shows revert reason

    User->>FE: Click "Get Loan"
    FE->>User: MetaMask sign prompt
    User->>Chain: Submit real tx
```

#### 3. Chainlink CRE Workflow Integration

```mermaid
sequenceDiagram
    participant CRON as CRE Cron Trigger<br/>(every 15 min)
    participant WF as gold-price-feed<br/>workflow
    participant EX as Price Sources<br/>Bybit · OKX · Kraken<br/>metals.dev · goldapi.io
    participant DON as Chainlink DON<br/>Nodes
    participant SC as BorrowingProtocolCRE<br/>Base Sepolia

    CRON->>WF: Trigger
    WF->>EX: Fetch XAUT/USD prices (parallel)
    EX-->>WF: 5 price feeds
    WF->>WF: Weighted median<br/>3x CEX + 1x metals.dev + 1x goldapi
    WF->>WF: USD to IDRX conversion<br/>(FX rate from config)
    WF->>DON: Consensus report<br/>xautPriceInIDRX (8 decimals)
    DON->>SC: setXAUTPrice(price)
    SC->>SC: Update collateral ratio for all loans
```

#### 4. Full Transaction Lifecycle

```mermaid
flowchart LR
    subgraph UX["User Journey"]
        A([Connect Wallet]) --> B[Faucet: Get XAUT]
        B --> C[Cash Loan Page]
        C --> D{KYC Level?}
        D -->|"Level 0: Guest"| E["Limited: Rp 5M max"]
        D -->|"Level 2: Enhanced"| F[Unlimited]
        E & F --> G[Enter loan amount]
        G --> H["Pre-flight Simulation\n(Tenderly REST API)"]
        H -->|Pass| I["Approve XAUT\n(MetaMask)"]
        H -->|Fail + reason| G
        I --> J["depositAndBorrow\n(MetaMask)"]
        J --> K([IDRX in wallet])
        K --> L[My Loans: Repay]
        L --> M["Repay Simulation\n(Tenderly REST API)"]
        M -->|Pass| N["repayAndWithdraw\n(MetaMask)"]
        N --> O([XAUT returned])
    end

    subgraph LIVE["Live Gold Rate"]
        CRE["Chainlink CRE\n15 min interval"] -->|setXAUTPrice| PRICE["On-chain XAUT price\nshown in UI"]
        PRICE --> G
    end
```

#### 5. Off-chain Settlement Flow

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend
    participant API as /api/redeem/*
    participant IDRX_API as IDRX Protocol API
    participant BANK as Indonesian Bank
    participant SC as Smart Contracts

    Note over User,SC: On-chain phase (Base Sepolia)
    User->>SC: repayAndWithdraw()
    SC->>User: XAUT returned
    SC->>SC: IDRX burned from user

    Note over User,BANK: Off-chain settlement phase
    User->>FE: Enter bank account + amount
    FE->>FE: Check amount vs 250M IDR limit

    alt Self-service (amount <= Rp 250M)
        FE->>API: POST /api/redeem/self-service
        API->>IDRX_API: submitRedeemRequest(txHash, amount, bankAccount)
        IDRX_API->>BANK: IDR bank transfer
        BANK-->>User: IDR in account (fast)
    else Treasury-assisted (amount > Rp 250M)
        FE->>API: POST /api/redeem/treasury-assisted
        API->>IDRX_API: submitTreasuryAssistedRequest(amount, bankAccount)
        IDRX_API-->>API: queued (est. 24 hours)
        IDRX_API->>BANK: IDR bank transfer (manual review)
        BANK-->>User: IDR in account (within 24h)
    end
```

---

## ️ Tech Stack

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

## 📁 Project Structure

```
auroom-base-fe/
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
│   │   ├── base_addresses.ts # Base Sepolia addresses
│   │   ├── chains.ts         # Chain configuration
│   │   └── abis/             # Contract ABIs
│   ├── wagmi.ts              # Wagmi configuration
│   └── utils/                # Utility functions
├── providers/                # React context providers
└── public/                   # Static assets
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or later
- pnpm (recommended) / npm / yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/AuroomProtocol/auroom-base-fe.git
cd auroom-base-fe

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

# Contract Addresses (Base Sepolia)
MOCK_IDRX=0x998ceb700e57f535873D189a6b1B7E2aA8C594EB
MOCK_USDC=0xCd88C2886A1958BA36238A070e71B51CF930b44d
XAUT=0x56EeDF50c3C4B47Ca9762298B22Cb86468f834FC
IDENTITY_REGISTRY=0xA8F2b8180caFC670f4a24114FDB9c50361038857
UNISWAP_FACTORY=0xDb198BEaccC55934062Be9AAEdce332c40A1f1Ed
UNISWAP_ROUTER=0x620870d419F6aFca8AFed5B516619aa50900cadc
PAIR_IDRX_USDC=0xd1fED56a7B4C93DF968494Bb9a6023546Da45D3B
PAIR_XAUT_USDC=0x61E24e8A69553D55bae612f2dF4d959654181652
SWAP_ROUTER=0x41c7215F0538200013F428732900bC581015c50e
BORROWING_PROTOCOL_V2=0x3A1229F6D51940DBa65710F9F6ab0296FD56718B

# IDRX API Configuration
IDRX_API_BASE_URL=https://api.idrx.org
IDRX_API_KEY=your_api_key_here
IDRX_MODE=demo  # Use 'demo' for testing, 'production' for real API
```

---

## 📜 Contract Addresses

All contracts are deployed on **Base Sepolia Testnet** (Chain ID: 84532)

| Contract | Address |
|----------|---------|
| **Tokens** | |
| IDRX | `0x998ceb700e57f535873D189a6b1B7E2aA8C594EB` |
| USDC | `0xCd88C2886A1958BA36238A070e71B51CF930b44d` |
| XAUT (Gold) | `0x56EeDF50c3C4B47Ca9762298B22Cb86468f834FC` |
| **Infrastructure** | |
| IdentityRegistry | `0xA8F2b8180caFC670f4a24114FDB9c50361038857` |
| UniswapV2Factory | `0xDb198BEaccC55934062Be9AAEdce332c40A1f1Ed` |
| UniswapV2Router | `0x620870d419F6aFca8AFed5B516619aa50900cadc` |
| **Liquidity Pairs** | |
| IDRX/USDC Pair | `0xd1fED56a7B4C93DF968494Bb9a6023546Da45D3B` |
| XAUT/USDC Pair | `0x61E24e8A69553D55bae612f2dF4d959654181652` |
| **Core Protocol** | |
| SwapRouter | `0x41c7215F0538200013F428732900bC581015c50e` |
| BorrowingProtocolV2 | `0x3A1229F6D51940DBa65710F9F6ab0296FD56718B` |

> 💡 **Block Explorer**: [Base Sepolia Basescan](https://sepolia.basescan.org)

---

## 🎮 How to Use

### 1. Connect Wallet

1. Click "Connect Wallet" button
2. Select your preferred wallet (MetaMask, Coinbase, etc.)
3. Switch to Base Sepolia network if prompted

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

## 🧪 Development

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

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

---

## 🔐 Security Notes

- ⚠️ **Testnet Only**: This is a demo on Base Sepolia
- ⚠️ **No Real Funds**: All tokens are mock/test tokens
- ⚠️ **KYC Required**: Users must be verified to use XAUT
- ⚠️ **Demo Mode**: IDRX redeem uses mock API by default
- ✅ **Non-Custodial**: You always control your keys
- ✅ **On-Chain Verification**: All burns are recorded on blockchain
- ✅ **Slippage Protection**: Built into all swaps

---

## 🗺️ Roadmap

- [x] Landing page with protocol info
- [x] Swap functionality (IDRX ↔ XAUT ↔ USDC)
- [x] Cash Loan with collateral (BorrowingProtocolV2)
- [x] IDRX Redeem to bank accounts
- [x] My Loans tracking page
- [x] Admin helper tools
- [x] Demo mode for testing
- [x] Live protocol statistics
- [x] Base Sepolia deployment
- [ ] Real IDRX API integration (production mode)
- [ ] Transaction history improvements
- [ ] Mobile app (React Native)
- [ ] Mainnet deployment on Base

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Base** - L2 Blockchain Infrastructure by Coinbase
- **IDRX.org** - Indonesian Rupiah stablecoin provider
- **RainbowKit** - Beautiful wallet connection
- **wagmi** - Excellent React hooks for Ethereum
- **Vercel** - Hosting platform
- **shadcn/ui** - UI component inspiration

---

<div align="center">

**Built with ❤️ on Base Sepolia**

[⬆ Back to Top](#-auroom-protocol---frontend)

</div>
