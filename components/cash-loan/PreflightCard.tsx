'use client';

import { Loader2, CheckCircle2, XCircle, Zap } from 'lucide-react';
import type { SimulationResult } from '@/hooks/useSimulateDeposit';

interface PreflightCardProps {
    result: SimulationResult;
}

export function PreflightCard({ result }: PreflightCardProps) {
    if (result.status === 'idle') return null;

    return (
        <div
            className={`
                flex items-start gap-3 px-4 py-3 rounded-xl border
                transition-all duration-300 animate-in fade-in slide-in-from-top-2
                ${result.status === 'loading'
                    ? 'bg-zinc-900/80 border-zinc-700'
                    : result.status === 'success'
                        ? 'bg-green-500/10 border-green-500/40'
                        : 'bg-red-500/10 border-red-500/40'}
            `}
        >
            {/* Icon */}
            <div className="mt-0.5 shrink-0">
                {result.status === 'loading' && (
                    <Loader2 className="w-4 h-4 text-white/40 animate-spin" />
                )}
                {result.status === 'success' && (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                )}
                {(result.status === 'reverted' || result.status === 'error') && (
                    <XCircle className="w-4 h-4 text-red-400" />
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                {result.status === 'loading' && (
                    <p className="text-white/50 text-xs">
                        Running pre-flight simulation via Tenderly…
                    </p>
                )}

                {result.status === 'success' && (
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                            <p className="text-green-400 text-xs font-semibold">
                                Transaction will succeed
                            </p>
                            <span className="flex items-center gap-0.5 text-[10px] text-white/30">
                                <Zap className="w-2.5 h-2.5" />
                                {result.gasUsed.toLocaleString()} gas
                            </span>
                        </div>
                        <p className="text-white/40 text-[11px]">
                            Verified by Tenderly simulation · no gas spent
                        </p>
                    </div>
                )}

                {result.status === 'reverted' && (
                    <div className="space-y-0.5">
                        <p className="text-red-400 text-xs font-semibold">
                            Transaction would fail
                        </p>
                        <p className="text-red-300/70 text-[11px] break-words">
                            {result.reason}
                        </p>
                    </div>
                )}

                {result.status === 'error' && (
                    <p className="text-red-400/70 text-xs">
                        Simulation unavailable: {result.message}
                    </p>
                )}
            </div>

            {/* Tenderly badge — only on success/fail */}
            {(result.status === 'success' || result.status === 'reverted') && (
                <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 self-center">
                    Tenderly
                </span>
            )}
        </div>
    );
}
