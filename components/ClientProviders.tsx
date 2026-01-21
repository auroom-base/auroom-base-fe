'use client';

import dynamic from 'next/dynamic';
import { ReactNode, useEffect, useState, createContext, useContext } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

// Base App Client FID (from documentation)
const BASE_APP_CLIENT_FID = 309857;

// Mini App context type
type MiniAppContextType = {
    isInMiniApp: boolean;
    isBaseApp: boolean;
    isLoading: boolean;
};

// Context for Mini App state
export const MiniAppContext = createContext<MiniAppContextType>({
    isInMiniApp: false,
    isBaseApp: false,
    isLoading: true,
});

export const useMiniAppContext = () => useContext(MiniAppContext);

const Web3Provider = dynamic(
    () => import('@/providers/Web3Provider').then((mod) => mod.Web3Provider),
    { ssr: false }
);

export function ClientProviders({ children }: { children: ReactNode }) {
    const [miniAppState, setMiniAppState] = useState<MiniAppContextType>({
        isInMiniApp: false,
        isBaseApp: false,
        isLoading: true,
    });

    useEffect(() => {
        const initMiniApp = async () => {
            try {
                const isInMiniApp = await sdk.isInMiniApp();

                if (isInMiniApp) {
                    const context = await sdk.context;
                    const isBaseApp = context?.client?.clientFid === BASE_APP_CLIENT_FID;

                    setMiniAppState({
                        isInMiniApp: true,
                        isBaseApp,
                        isLoading: false,
                    });

                    console.log('[MiniApp] Running in Mini App, isBaseApp:', isBaseApp);
                } else {
                    setMiniAppState({
                        isInMiniApp: false,
                        isBaseApp: false,
                        isLoading: false,
                    });
                }

                // Signal to Base App that the mini app is ready
                sdk.actions.ready();
            } catch (error) {
                console.error('[MiniApp] Init error:', error);
                setMiniAppState({
                    isInMiniApp: false,
                    isBaseApp: false,
                    isLoading: false,
                });
                // Still call ready even if context fails
                sdk.actions.ready();
            }
        };

        initMiniApp();
    }, []);

    return (
        <MiniAppContext.Provider value={miniAppState}>
            <Web3Provider>{children}</Web3Provider>
        </MiniAppContext.Provider>
    );
}
