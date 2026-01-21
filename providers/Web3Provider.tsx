'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { baseSepolia } from '@/lib/contracts/chains';
import { ReactNode, useMemo } from 'react';

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: ReactNode }) {
    const config = useMemo(() => {
        return getDefaultConfig({
            appName: 'AuRoom Protocol',
            projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
            chains: [baseSepolia],
            ssr: true,
        });
    }, []);

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
