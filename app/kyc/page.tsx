'use client'

import { useState } from 'react'
import { useKycLevel } from '@/hooks/contracts/useIdentityRegistryV2'
import { KycStatusCard } from '@/components/kyc/KycStatusCard'
import { KycForm } from '@/components/kyc/KycForm'
import Link from 'next/link'

export default function KycPage() {
    const { level, isLoading } = useKycLevel()
    const [showForm, setShowForm] = useState(false)
    const [successTx, setSuccessTx] = useState<{ hash: string; newLevel: number } | null>(null)

    const targetLevel = level < 2 ? ((level + 1) as 1 | 2) : null

    const handleSuccess = (hash: string, newLevel: number) => {
        setSuccessTx({ hash, newLevel })
        setShowForm(false)
    }

    return (
        <main className="min-h-screen bg-zinc-950 px-4 py-16">
            <div className="max-w-lg mx-auto space-y-6">

                {/* Page header */}
                <div>
                    <h1 className="text-2xl font-bold text-white">🪪 Identity Verification</h1>
                    <p className="text-zinc-400 text-sm mt-1">
                        Higher KYC levels unlock larger borrowing limits.
                    </p>
                </div>

                {/* Status card */}
                <KycStatusCard onUpgrade={targetLevel ? () => setShowForm(true) : undefined} />

                {/* Success state */}
                {successTx && (
                    <div className="rounded-2xl border border-emerald-700 bg-emerald-900/20 p-6 space-y-3">
                        <p className="text-emerald-400 font-semibold">
                            ✅ KYC Level {successTx.newLevel} activated!
                        </p>
                        <a
                            href={`https://virtual.basescan.org/tx/${successTx.hash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="block text-xs text-zinc-400 hover:text-white break-all"
                        >
                            Tx: {successTx.hash}
                        </a>
                        {successTx.newLevel < 2 && (
                            <button
                                onClick={() => { setSuccessTx(null); setShowForm(true) }}
                                className="text-sm text-amber-400 hover:underline"
                            >
                                Upgrade to Level 2 →
                            </button>
                        )}
                        <div className="pt-1">
                            <Link
                                href="/cash-loan"
                                className="block w-full text-center py-2.5 rounded-xl bg-amber-500 text-black font-semibold text-sm hover:opacity-90 transition-opacity"
                            >
                                → Go to Cash Loan
                            </Link>
                        </div>
                    </div>
                )}

                {/* KYC Form */}
                {showForm && targetLevel && !successTx && (
                    <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-white font-semibold">
                                Level {targetLevel} Verification
                            </h2>
                            <button
                                onClick={() => setShowForm(false)}
                                className="text-zinc-500 hover:text-white text-sm transition-colors"
                            >
                                ✕ Cancel
                            </button>
                        </div>
                        <KycForm targetLevel={targetLevel} onSuccess={handleSuccess} />
                    </div>
                )}

                {/* Already at max level */}
                {!isLoading && level === 2 && !successTx && (
                    <div className="rounded-2xl border border-emerald-700/40 bg-emerald-900/10 p-6 text-center space-y-2">
                        <p className="text-emerald-400 font-medium">🏆 Fully Verified</p>
                        <p className="text-zinc-400 text-sm">No borrowing limits apply to your account.</p>
                        <Link href="/cash-loan"
                            className="inline-block mt-2 text-sm text-amber-400 hover:underline">
                            → Go to Cash Loan
                        </Link>
                    </div>
                )}

                {/* Faucet link */}
                <p className="text-center text-xs text-zinc-600">
                    Need test XAUT?{' '}
                    <Link href="/faucet" className="text-amber-500 hover:underline">
                        Use the XAUT faucet →
                    </Link>
                </p>
            </div>
        </main>
    )
}
