'use client'

import { useKycLevel, TIER_LIMITS, type KycLevel } from '@/hooks/contracts/useIdentityRegistryV2'

const LEVEL_LABELS: Record<KycLevel, { label: string; color: string; bg: string; border: string }> = {
    0: { label: 'Guest', color: 'text-zinc-400', bg: 'bg-zinc-800/60', border: 'border-zinc-700' },
    1: { label: 'Basic KYC', color: 'text-amber-400', bg: 'bg-amber-900/30', border: 'border-amber-700' },
    2: { label: 'Enhanced KYC', color: 'text-emerald-400', bg: 'bg-emerald-900/30', border: 'border-emerald-700' },
}

function formatXAUT(wei: bigint): string {
    if (wei === BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')) return 'Unlimited'
    return (Number(wei) / 1e18).toFixed(1) + ' XAUT'
}

function formatIDRX(raw: bigint): string {
    if (raw === BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')) return 'Unlimited'
    const m = Number(raw) / 1e12
    return m >= 1 ? `${m.toFixed(0)}M IDRX` : `${(Number(raw) / 1e9).toFixed(0)}K IDRX`
}

interface KycStatusCardProps {
    onUpgrade?: () => void
}

export function KycStatusCard({ onUpgrade }: KycStatusCardProps) {
    const { level, limits, isLoading } = useKycLevel()
    const style = LEVEL_LABELS[level]
    const nextLevel = (level < 2 ? level + 1 : null) as KycLevel | null

    if (isLoading) {
        return (
            <div className="rounded-2xl border border-zinc-700 bg-zinc-800/60 p-6 animate-pulse">
                <div className="h-5 w-32 rounded bg-zinc-700 mb-3" />
                <div className="h-4 w-48 rounded bg-zinc-700" />
            </div>
        )
    }

    return (
        <div className={`rounded-2xl border ${style.border} ${style.bg} p-6 space-y-4`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">KYC Status</p>
                    <div className="flex items-center gap-2">
                        <span className={`text-2xl font-bold ${style.color}`}>Level {level}</span>
                        <span className={`text-sm px-2 py-0.5 rounded-full border ${style.border} ${style.color}`}>
                            {style.label}
                        </span>
                    </div>
                </div>
                {/* Tier progress dots */}
                <div className="flex gap-1.5">
                    {([0, 1, 2] as KycLevel[]).map(l => (
                        <div
                            key={l}
                            className={`w-3 h-3 rounded-full ${l <= level ? LEVEL_LABELS[l].color.replace('text-', 'bg-') : 'bg-zinc-700'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Limits table */}
            <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-lg bg-black/20 p-3">
                    <p className="text-zinc-500 text-xs mb-0.5">Max Collateral</p>
                    <p className="text-white font-medium">{formatXAUT(limits.maxCollateral)}</p>
                </div>
                <div className="rounded-lg bg-black/20 p-3">
                    <p className="text-zinc-500 text-xs mb-0.5">Max Borrow</p>
                    <p className="text-white font-medium">{formatIDRX(limits.maxBorrow)}</p>
                </div>
                <div className="rounded-lg bg-black/20 p-3">
                    <p className="text-zinc-500 text-xs mb-0.5">Max LTV</p>
                    <p className="text-white font-medium">{Number(limits.maxLtv) / 100}%</p>
                </div>
                <div className="rounded-lg bg-black/20 p-3">
                    <p className="text-zinc-500 text-xs mb-0.5">Liquidation at</p>
                    <p className="text-white font-medium">{Number(limits.liquidationLtv) / 100}%</p>
                </div>
            </div>

            {/* Upgrade CTA */}
            {nextLevel !== null && onUpgrade && (
                <button
                    onClick={onUpgrade}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                    Upgrade to Level {nextLevel} — {TIER_LIMITS[nextLevel].label} →
                </button>
            )}

            {level === 2 && (
                <div className="flex items-center gap-2 text-emerald-400 text-sm">
                    <span>✓</span>
                    <span>You&apos;re fully verified — no borrowing limits apply</span>
                </div>
            )}
        </div>
    )
}
