import { defineChain } from 'viem';
import { baseSepolia } from 'viem/chains';

// Primary chain for AuRoom Protocol — real Base Sepolia (chain 84532)
// Contracts deployed here, CRE workflow writes here.
export { baseSepolia };

/**
 * Tenderly VTN — kept for dev scripts and local testing only.
 * NOT used by the frontend in production.
 */
export const tenderlyVTN = defineChain({
    id: 99984532,
    name: 'AuRoom Testnet (Tenderly)',
    network: 'tenderly-vtn',
    nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
    },
    rpcUrls: {
        default: {
            http: [process.env.NEXT_PUBLIC_TENDERLY_RPC || 'https://virtual.base-sepolia.eu.rpc.tenderly.co/8f126ea1-5900-449a-b5ce-842ee5612a06'],
        },
        public: {
            http: [process.env.NEXT_PUBLIC_TENDERLY_RPC || 'https://virtual.base-sepolia.eu.rpc.tenderly.co/8f126ea1-5900-449a-b5ce-842ee5612a06'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Tenderly Explorer',
            url: 'https://dashboard.tenderly.co/explorer',
        },
    },
    testnet: true,
});

