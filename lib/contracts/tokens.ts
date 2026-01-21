import { BASE_CONTRACTS as CONTRACTS } from './base_addresses';

export const TOKENS = {
    IDRX: {
        address: CONTRACTS.IDRX,
        symbol: "IDRX",
        name: "Indonesian Rupiah",
        decimals: 6,
        icon: "/tokens/idrx.svg",
        color: "#E11D48",
    },
    USDC: {
        address: CONTRACTS.USDC,
        symbol: "USDC",
        name: "USD Coin",
        decimals: 6,
        icon: "/tokens/usdc.svg",
        color: "#2775CA",
    },
    XAUT: {
        address: CONTRACTS.XAUT,
        symbol: "XAUT",
        name: "Tether Gold",
        decimals: 6,
        icon: "/tokens/xaut.svg",
        color: "#F7931A",
    },
} as const;

export type TokenSymbol = keyof typeof TOKENS;
export type Token = typeof TOKENS[TokenSymbol];
