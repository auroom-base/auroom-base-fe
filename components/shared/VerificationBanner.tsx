'use client';

import { useAccount } from 'wagmi';
import { useKycLevel } from '@/hooks/contracts/useIdentityRegistryV2';
import { AlertTriangle, ShieldCheck, Shield } from 'lucide-react';
import Link from 'next/link';

export function VerificationBanner() {
    const { isConnected } = useAccount();
    const { level, isLoading } = useKycLevel();

    // Hide if not connected or loading
    if (!isConnected || isLoading) return null;

    // Level 2 — fully verified, show nothing
    if (level === 2) return null;

    // Level 0 — no KYC at all
    if (level === 0) {
        return (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                        <h3 className="text-yellow-500 font-semibold text-sm mb-1">
                            No KYC — Limited Access (Level 0)
                        </h3>
                        <p className="text-white/70 text-sm mb-3">
                            You can borrow up to <span className="text-yellow-400 font-medium">5M IDRX</span> with{' '}
                            <span className="text-yellow-400 font-medium">0.1 XAUT</span> max collateral.
                            Complete KYC to unlock higher limits.
                        </p>
                        <Link
                            href="/kyc"
                            className="inline-flex items-center gap-1.5 text-xs bg-yellow-500/20 text-yellow-400 px-3 py-1.5 rounded-lg hover:bg-yellow-500/30 transition-colors font-medium"
                        >
                            <Shield className="w-3.5 h-3.5" />
                            Complete Level 1 KYC →
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Level 1 — basic KYC, prompt upgrade
    return (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                    <h3 className="text-amber-400 font-semibold text-sm mb-1">
                        Basic KYC Active — Level 1
                    </h3>
                    <p className="text-white/70 text-sm mb-3">
                        Max borrow: <span className="text-amber-400 font-medium">50M IDRX</span> ·{' '}
                        Max collateral: <span className="text-amber-400 font-medium">0.5 XAUT</span>.
                        Upgrade to Level 2 for unlimited access.
                    </p>
                    <Link
                        href="/kyc"
                        className="inline-flex items-center gap-1.5 text-xs bg-amber-500/20 text-amber-400 px-3 py-1.5 rounded-lg hover:bg-amber-500/30 transition-colors font-medium"
                    >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Upgrade to Level 2 →
                    </Link>
                </div>
            </div>
        </div>
    );
}
