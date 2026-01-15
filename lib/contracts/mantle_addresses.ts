// Contract addresses for Mantle Sepolia (Chain ID: 5003)

export const MANTLE_CONTRACTS = {
    // ===== TOKENS =====
    IDRX: "0xf0C848387950609a3F97e3d67363C46562aD0e28" as const,
    USDC: "0xc76AfD7BAd35e66A6146564DDc391C97300c642b" as const,
    XAUT: "0xab8c0a0a773356A0843567b89E6e4330FDa7B9D6" as const,

    // ===== INFRASTRUCTURE =====
    IdentityRegistry: "0x28532929e2A67Dba781391bA0f7663b0cADA655F" as const,
    UniswapV2Factory: "0x55c3D72C2F35A157ee154Bb37B7dDC9be0132BBf" as const,
    UniswapV2Router: "0x7064Acd14aD0a4b75997C0CcBAD2C89DadA6df69" as const,

    // ===== LIQUIDITY PAIRS =====
    IDRX_USDC_Pair: "0x3d134aDD1BfCc62e68CfA98D6A8b5Bb0d511f815" as const,
    XAUT_USDC_Pair: "0xD4a1Bd11386C0F2619A849044294296253a6369B" as const,

    // ===== CORE PROTOCOL =====
    SwapRouter: "0x8980c7477E091E06f34a418c9fc923D1df849734" as const,
    BorrowingProtocolV2: "0xb38139e077621421eba724008bB33C10996E6435" as const,

    // Alias for backward compatibility
    BorrowingProtocol: "0xb38139e077621421eba724008bB33C10996E6435" as const,
} as const;

export type ContractName = keyof typeof MANTLE_CONTRACTS;

export const DEPLOYER = "0x742812a2Ff08b76f968dffA7ca6892A428cAeBb1" as const;
export const TREASURY = "0x742812a2Ff08b76f968dffA7ca6892A428cAeBb1" as const;
