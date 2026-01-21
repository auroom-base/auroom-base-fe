'use client';

import { useAccount } from 'wagmi';
import { useIdentityRegistry } from '@/hooks/contracts/useIdentityRegistry';
import { AlertTriangle, Shield, ExternalLink } from 'lucide-react';

export function VerificationBanner() {
    const { address, isConnected } = useAccount();
    const { useIsVerified } = useIdentityRegistry();
    const { data: isVerified, isLoading } = useIsVerified(address);

    // Don't show if not connected, loading, or already verified
    if (!isConnected || isLoading || isVerified) {
        return null;
    }

    return (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-yellow-500 font-semibold text-sm mb-1">
                        Wallet Not Verified
                    </h3>
                    <p className="text-white/70 text-sm mb-3">
                        Your wallet needs to be verified before you can use this feature.
                        Verification is required for all transactions on AuRoom.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-2 text-xs text-white/50">
                            <Shield className="w-4 h-4" />
                            <span>Request verification coming soon</span>
                        </div>
                        <a
                            href="mailto:cinder.54-garret@icloud.com?subject=Verification Request&body=Wallet Address: "
                            className="inline-flex items-center gap-1.5 text-xs text-yellow-400 hover:text-yellow-300 transition-colors"
                        >
                            <span>Contact Admin</span>
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
