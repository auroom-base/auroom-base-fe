'use client'

import { useXAUTFaucet, useXAUTBalance } from '@/hooks/contracts/useXAUTFaucet'
import { useAccount } from 'wagmi'
import Link from 'next/link'

function formatXAUT(wei: bigint): string {
    // XAUT has 6 decimals
    return (Number(wei) / 1e6).toFixed(4) + ' XAUT'
}

export function FaucetCard() {
    const { address } = useAccount()
    const { balance } = useXAUTBalance()
    const { drip, isPending, isSuccess, error, hash, cooldownSeconds, canDrip } = useXAUTFaucet()

    if (!address) {
        return (
            <div className="rounded-2xl border border-zinc-700 bg-zinc-800/60 p-8 text-center space-y-3">
                <div className="text-4xl">🔌</div>
                <p className="text-zinc-400 text-sm">Connect your wallet to use the faucet</p>
            </div>
        )
    }

    return (
        <div className="rounded-2xl border border-amber-700/40 bg-gradient-to-b from-amber-950/30 to-zinc-900 p-8 space-y-6">
            {/* Header */}
            <div className="text-center space-y-1">
                <div className="text-5xl mb-3">🪙</div>
                <h2 className="text-xl font-bold text-white">XAUT Testnet Faucet</h2>
                <p className="text-zinc-400 text-sm">Get test gold to try AuRoom borrowing</p>
            </div>

            {/* Base Sepolia ETH info banner */}
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/30">
                <span className="text-lg shrink-0">⛽</span>
                <div className="text-xs text-blue-300/80 space-y-1">
                    <p className="font-semibold text-blue-300">Base Sepolia ETH required</p>
                    <p>You need a small amount of Base Sepolia ETH to pay for the mint transaction gas fee.
                        Get free ETH at <a href="https://www.alchemy.com/faucets/base-sepolia" target="_blank" rel="noreferrer" className="underline hover:text-white">Alchemy Faucet</a> or <a href="https://faucet.quicknode.com/base/sepolia" target="_blank" rel="noreferrer" className="underline hover:text-white">QuickNode Faucet</a>.</p>
                </div>
            </div>

            {/* Balance */}
            <div className="rounded-xl bg-black/30 border border-zinc-700 px-6 py-4 text-center">
                <p className="text-xs text-zinc-500 mb-1">Your XAUT Balance</p>
                <p className="text-2xl font-bold text-amber-400">{formatXAUT(balance)}</p>
            </div>

            {/* Drip button */}
            <button
                onClick={drip}
                disabled={!canDrip}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold text-base disabled:opacity-50 hover:opacity-90 active:scale-95 transition-all"
            >
                {isPending && '⏳ Minting...'}
                {!isPending && cooldownSeconds > 0 && `⏳ Next drip in ${cooldownSeconds}s`}
                {!isPending && cooldownSeconds === 0 && '⚡ Request 0.01 XAUT'}
            </button>

            {/* Success state */}
            {isSuccess && hash && (
                <div className="rounded-xl bg-emerald-900/30 border border-emerald-700 px-4 py-3 space-y-2">
                    <p className="text-emerald-400 font-medium text-sm">✅ 0.01 XAUT sent to your wallet!</p>
                    <a
                        href={`https://sepolia.basescan.org/tx/${hash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-zinc-400 hover:text-white break-all"
                    >
                        Tx: {hash}
                    </a>
                    <div className="pt-1">
                        <Link
                            href="/cash-loan"
                            className="w-full block text-center py-2.5 rounded-xl bg-amber-500 text-black font-semibold text-sm hover:opacity-90 transition-opacity"
                        >
                            → Go to Cash Loan
                        </Link>
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="rounded-xl bg-red-900/30 border border-red-700 px-4 py-3 text-red-300 text-sm">
                    ⚠️ {error.message}
                </div>
            )}

            {/* Info */}
            <p className="text-center text-xs text-zinc-600">
                Drip limit: 0.01 XAUT per request &nbsp;·&nbsp; 60-second cooldown
            </p>
        </div>
    )
}
