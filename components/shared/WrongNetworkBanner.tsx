'use client';

import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { baseSepolia } from '@/lib/contracts/chains';
import { AlertTriangle } from 'lucide-react';

/**
 * Shows a banner when the user is connected but NOT on Base Sepolia.
 * AuRoom contracts are deployed on Base Sepolia (chain ID 84532).
 */
export function WrongNetworkBanner() {
    const { isConnected } = useAccount();
    const chainId = useChainId();
    const { switchChain, isPending } = useSwitchChain();

    const isOnCorrectChain = chainId === baseSepolia.id;

    if (!isConnected || isOnCorrectChain) return null;

    return (
        <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                    <h3 className="text-red-400 font-semibold text-sm mb-1">
                        Wrong Network
                    </h3>
                    <p className="text-white/70 text-sm mb-3">
                        AuRoom contracts are on{' '}
                        <span className="text-white font-medium">Base Sepolia</span>.
                        Please switch networks to interact with the protocol.
                    </p>
                    <button
                        onClick={() => switchChain({ chainId: baseSepolia.id })}
                        disabled={isPending}
                        className="inline-flex items-center gap-2 text-xs bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/30 transition-colors font-medium disabled:opacity-50"
                    >
                        {isPending ? 'Switching...' : 'Switch to Base Sepolia'}
                    </button>
                </div>
            </div>
        </div>
    );
}
