'use client';

import { useLandingStats } from '@/hooks/useLandingStats';
import { TrendingUp, Wallet, Coins, ArrowUpRight } from 'lucide-react';

/**
 * Client component for live blockchain stats.
 * Fetches real-time data from smart contracts.
 */
export function LiveStats() {
    const stats = useLandingStats();

    return (
        <div className="grid md:grid-cols-3 gap-6">
            {/* Total Loans */}
            <div className="group relative bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-[#F5A623]/50 transition-all duration-300">
                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity duration-300">
                    <TrendingUp className="w-12 h-12 text-[#F5A623]" />
                </div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="p-2 bg-[#F5A623]/10 rounded-lg text-[#F5A623]">
                        <Wallet className="w-5 h-5" />
                    </span>
                    <span className="text-gray-400 font-medium">Loans Disbursed</span>
                </div>
                <div className="text-4xl font-bold text-white mb-1">
                    {stats.totalLoans}
                </div>
                <div className="text-sm text-gray-500">Active borrower contracts</div>
            </div>

            {/* Gold Collateral */}
            <div className="group relative bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-[#F5A623]/50 transition-all duration-300">
                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity duration-300">
                    <Coins className="w-12 h-12 text-[#F5A623]" />
                </div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="p-2 bg-[#F5A623]/10 rounded-lg text-[#F5A623]">
                        <ArrowUpRight className="w-5 h-5" />
                    </span>
                    <span className="text-gray-400 font-medium">Gold Secured</span>
                </div>
                <div className="text-4xl font-bold text-white mb-1">
                    {stats.totalCollateral} <span className="text-lg text-[#F5A623]">XAUT</span>
                </div>
                <div className="text-sm text-gray-500">≈ {stats.totalCollateralIDR}</div>
            </div>

            {/* Gold Price */}
            <div className="group relative bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-[#F5A623]/50 transition-all duration-300">
                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowUpRight className="w-12 h-12 text-[#F5A623]" />
                </div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="p-2 bg-[#F5A623]/10 rounded-lg text-[#F5A623]">
                        <TrendingUp className="w-5 h-5" />
                    </span>
                    <span className="text-gray-400 font-medium">Live Gold Price</span>
                </div>
                <div className="text-4xl font-bold text-white mb-1">
                    {stats.xautPriceIdrx}
                </div>
                <div className="text-sm text-gray-500">IDR per 1 XAUT (1 oz)</div>
            </div>
        </div>
    );
}
