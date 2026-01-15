'use client';

import { useEffect, useState } from 'react';
import { SectionWrapper } from './shared/SectionWrapper';
import { StatCard } from './shared/StatCard';
import { useLandingStats } from '@/hooks/useLandingStats';
import { RefreshCw } from 'lucide-react';

export function LiveStats() {
    const stats = useLandingStats(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdated(new Date());
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        if (seconds < 60) return `${seconds} seconds ago`;
        const minutes = Math.floor(seconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    };

    return (
        <SectionWrapper background="default" id="live-stats">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                        Live <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 bg-clip-text text-transparent">Protocol Stats</span>
                    </h2>
                    <p className="text-lg text-white/70">
                        Real-time data from AuRoom smart contracts on Mantle Sepolia
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard
                        label="Total Collateral (IDR)"
                        value={stats.isLoading ? '...' : stats.totalCollateralIDR}
                        isLoading={stats.isLoading}
                        animate
                    />
                    <StatCard
                        label="XAUT Collateral"
                        value={stats.isLoading ? '...' : `${parseFloat(stats.totalCollateral).toFixed(4)}`}
                        isLoading={stats.isLoading}
                    />
                    <StatCard
                        label="Total Loans"
                        value={stats.isLoading ? '...' : stats.totalLoans}
                        isLoading={stats.isLoading}
                    />
                </div>

                {/* Exchange Rate */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-center mb-6 text-white">Current Exchange Rate</h3>
                    <div className="text-center space-y-4">
                        <div className="space-y-2">
                            <div className="text-4xl font-bold font-mono bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                                1 XAUT = {stats.xautPriceIdrx} IDRX
                            </div>
                            <div className="text-lg text-white/70">
                                ≈ ${stats.xautPrice} USD
                            </div>
                            <div className="text-sm text-white/60">
                                ≈ Rp {stats.xautPriceIdrx}
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm text-white/60 pt-4">
                            <RefreshCw className="h-4 w-4" />
                            <span>Last updated: {formatTime(lastUpdated)}</span>
                        </div>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="text-center text-sm text-white/60">
                    <p>* Stats auto-refresh every 30 seconds from on-chain data</p>
                </div>
            </div>
        </SectionWrapper>
    );
}
