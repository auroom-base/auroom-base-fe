'use client';

import { Button } from '@/components/ui/button';
import { formatRupiah } from '@/lib/utils/format';
import { AlertTriangle, ArrowRight, X, Wallet } from 'lucide-react';

interface ResumeSessionBannerProps {
    borrowedAmount: bigint;
    collateralAmount: bigint;
    onContinue: () => void;
    onDismiss: () => void;
    onViewLoans: () => void;
}

/**
 * ResumeSessionBanner
 * 
 * Displayed when user has an active loan with IDRX balance
 * but may have forgotten to complete the redeem step
 */
export function ResumeSessionBanner({
    borrowedAmount,
    collateralAmount,
    onContinue,
    onDismiss,
    onViewLoans,
}: ResumeSessionBannerProps) {
    return (
        <div className="relative bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border-2 border-yellow-500/50 rounded-2xl p-6 mb-6">
            {/* Dismiss button */}
            <button
                onClick={onDismiss}
                className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors"
                aria-label="Dismiss"
            >
                <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-yellow-400" />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">
                        Resume Your Session
                    </h3>
                    <p className="text-white/70 text-sm mb-2">
                        You have an active loan that may need to be redeemed to your bank account.
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-yellow-400" />
                            <span className="text-white/60">Borrowed:</span>
                            <span className="text-yellow-400 font-semibold">
                                {formatRupiah(borrowedAmount)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-white/60">Collateral:</span>
                            <span className="text-amber-400 font-semibold">
                                {(Number(collateralAmount) / 1e6).toFixed(4)} XAUT
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 md:flex-shrink-0">
                    <Button
                        onClick={onContinue}
                        className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold"
                    >
                        Continue to Redeem
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button
                        onClick={onViewLoans}
                        variant="outline"
                        className="border-yellow-500/30 text-white hover:bg-yellow-500/10"
                    >
                        View My Loans
                    </Button>
                </div>
            </div>
        </div>
    );
}
