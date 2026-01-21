import { defineChain } from 'viem';

export const baseSepolia = defineChain({
    id: 84532,
    name: 'Base Sepolia',
    network: 'base-sepolia',
    nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
    },
    rpcUrls: {
        default: {
            http: ['https://sepolia.base.org'],
        },
        public: {
            http: ['https://sepolia.base.org'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Base Sepolia Explorer',
            url: 'https://sepolia.basescan.org',
        },
    },
    testnet: true,
});
