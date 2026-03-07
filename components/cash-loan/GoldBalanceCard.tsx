'use client';

import { formatRupiah, formatXAUT } from '@/lib/utils/format';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

interface GoldBalanceCardProps {
    balance: bigint;
    balanceValue: bigint;
    maxLoan: bigint;
    xautPrice: bigint;
    kycLevel?: 0 | 1 | 2;
    isLoading?: boolean;
}

export function GoldBalanceCard({
    balance,
    balanceValue,
    maxLoan,
    xautPrice,
    kycLevel,
    isLoading
}: GoldBalanceCardProps) {
    if (isLoading) {
        return (
            <div className="p-6 rounded-2xl bg-zinc-900 border-2 border-yellow-500/30 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-yellow-500 animate-spin" />
            </div>
        );
    }

    const hasNoGold = balance === 0n;
    const hasLowKyc = kycLevel !== undefined && kycLevel < 2;

    return (
        <div className="p-6 rounded-2xl bg-zinc-900 border-2 border-yellow-500/30">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                🥇 YOUR GOLD
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Amount */}
                <div className="p-4 rounded-xl bg-black/40 border border-yellow-500/20">
                    <p className="text-white/60 text-sm mb-1">Amount</p>
                    <p className="text-white font-bold text-xl">{formatXAUT(balance)} XAUT</p>
                </div>

                {/* Value */}
                <div className="p-4 rounded-xl bg-black/40 border border-yellow-500/20">
                    <p className="text-white/60 text-sm mb-1">Value</p>
                    <p className="text-white font-bold text-xl">{formatRupiah(balanceValue)}</p>
                </div>
            </div>

            {/* Max Loan Info */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 mb-3">
                <p className="text-white/90 text-sm">
                    💡 <span className="font-semibold">You can borrow up to:</span>{' '}
                    <span className="text-yellow-400 font-bold">{formatRupiah(maxLoan)}</span>
                </p>
                <p className="text-white/50 text-xs mt-1">
                    Based on your gold balance
                </p>
            </div>

            {/* Contextual tip links */}
            {hasNoGold && (
                <Link
                    href="/faucet"
                    className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm hover:bg-amber-500/20 transition-colors"
                >
                    <span>💧 Need XAUT? Use the testnet faucet</span>
                    <span>→</span>
                </Link>
            )}
            {!hasNoGold && hasLowKyc && (
                <Link
                    href="/kyc"
                    className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm hover:border-amber-500/50 hover:text-amber-400 transition-colors"
                >
                    <span>🪪 Upgrade KYC for higher borrow limits</span>
                    <span>→</span>
                </Link>
            )}
        </div>
    );
}
