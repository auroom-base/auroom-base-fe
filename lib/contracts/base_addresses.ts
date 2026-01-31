// Contract addresses for Base Sepolia (Chain ID: 84532)

export const BASE_CONTRACTS = {
    // ===== TOKENS =====
    IDRX: "0x998ceb700e57f535873D189a6b1B7E2aA8C594EB" as const,
    USDC: "0xCd88C2886A1958BA36238A070e71B51CF930b44d" as const,
    XAUT: "0x56EeDF50c3C4B47Ca9762298B22Cb86468f834FC" as const,

    // ===== INFRASTRUCTURE =====
    IdentityRegistry: "0xA8F2b8180caFC670f4a24114FDB9c50361038857" as const,
    UniswapV2Factory: "0xDb198BEaccC55934062Be9AAEdce332c40A1f1Ed" as const,
    UniswapV2Router: "0x620870d419F6aFca8AFed5B516619aa50900cadc" as const,

    // ===== LIQUIDITY PAIRS =====
    IDRX_USDC_Pair: "0xd1fED56a7B4C93DF968494Bb9a6023546Da45D3B" as const,
    XAUT_USDC_Pair: "0x61E24e8A69553D55bae612f2dF4d959654181652" as const,

    // ===== CORE PROTOCOL =====
    SwapRouter: "0x41c7215F0538200013F428732900bC581015c50e" as const,
    BorrowingProtocolV2: "0x3A1229F6D51940DBa65710F9F6ab0296FD56718B" as const,
    SpendPermissionManager: "0xf85210B21cC50302F477BA56686d2019dC9b67Ad" as const,

    // Alias for backward compatibility
    BorrowingProtocol: "0x3A1229F6D51940DBa65710F9F6ab0296FD56718B" as const,
} as const;

export type ContractName = keyof typeof BASE_CONTRACTS;

export const DEPLOYER = "0x742812a2Ff08b76f968dffA7ca6892A428cAeBb1" as const;
export const TREASURY = "0x742812a2Ff08b76f968dffA7ca6892A428cAeBb1" as const;
