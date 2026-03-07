'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';
import { baseSepolia } from '@/lib/contracts/chains';
import { ReactNode, useEffect, useRef } from 'react';
import { useConnect, useAccount } from 'wagmi';
import { sdk } from '@farcaster/miniapp-sdk';
import { AutoFundOnConnect } from '@/components/providers/AutoFundOnConnect';

const queryClient = new QueryClient();

// Base Sepolia — real chain where CRE workflow writes gold prices
const config = createConfig({
    chains: [baseSepolia],
    connectors: [
        coinbaseWallet({
            appName: 'AuRoom Protocol',
            preference: 'smartWalletOnly',
        }),
        injected(),
        walletConnect({
            projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
        }),
    ],
    transports: {
        [baseSepolia.id]: http(), // uses wagmi's built-in Base Sepolia public RPC
    },
    ssr: true,
});


// Auto-connect component for Base App
function AutoConnectHandler({ children }: { children: ReactNode }) {
    const { connect, connectors } = useConnect();
    const { isConnected, isConnecting } = useAccount();
    const hasAttemptedAutoConnect = useRef(false);

    useEffect(() => {
        const autoConnect = async () => {
            // Prevent multiple auto-connect attempts
            if (hasAttemptedAutoConnect.current || isConnected || isConnecting) {
                return;
            }

            try {
                // Check if running inside Base App / Farcaster client
                const isInMiniApp = await sdk.isInMiniApp();

                if (isInMiniApp) {
                    hasAttemptedAutoConnect.current = true;
                    console.log('[AutoConnect] Detected Mini App environment, attempting auto-connect...');

                    // Find Coinbase Wallet connector
                    const coinbaseConnector = connectors.find(
                        (c) => c.id === 'coinbaseWalletSDK'
                    );

                    if (coinbaseConnector) {
                        console.log('[AutoConnect] Found Coinbase connector, connecting...');
                        connect({ connector: coinbaseConnector });
                    } else {
                        console.warn('[AutoConnect] Coinbase connector not found');
                    }
                }
            } catch (error) {
                console.error('[AutoConnect] Failed:', error);
            }
        };

        autoConnect();
    }, [connect, connectors, isConnected, isConnecting]);

    return <>{children}</>;
}

export function Web3Provider({ children }: { children: ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    <AutoFundOnConnect />
                    <AutoConnectHandler>
                        {children}
                    </AutoConnectHandler>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
