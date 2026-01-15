'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { ActiveLoanCard } from '@/components/cash-loan/ActiveLoanCard';
import { RepayModal } from '@/components/cash-loan/RepayModal';
import { useActiveLoan, useIDRXBalance, useRepay } from '@/hooks/useLoan';
import { formatRupiah, formatXAUT } from '@/lib/utils/format';
import {
    CheckCircle2,
    Clock,
    XCircle,
    Briefcase,
    TrendingUp,
    TrendingDown,
    Wallet,
    History,
    ExternalLink,
    AlertCircle
} from 'lucide-react';
import { VerificationBanner } from '@/components/shared/VerificationBanner';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// Types
type LoanStatus = 'completed' | 'pending' | 'failed';
type LoanType = 'borrow' | 'repay';

interface LoanHistoryItem {
    id: string;
    date: string;
    type: LoanType;
    amount: bigint;
    collateral: bigint;
    status: LoanStatus;
    txHash: string;
}

// Mock data for loan history
const mockLoanHistory: LoanHistoryItem[] = [
    {
        id: '1',
        date: '2026-01-05',
        type: 'borrow',
        amount: 10_000_000n * BigInt(1e6), // 10M IDR
        collateral: 515_000n, // 0.515 XAUT
        status: 'completed',
        txHash: '0x1234...5678',
    },
    {
        id: '2',
        date: '2026-01-05',
        type: 'repay',
        amount: 10_000_000n * BigInt(1e6),
        collateral: 515_000n,
        status: 'completed',
        txHash: '0xabcd...efgh',
    },
    {
        id: '3',
        date: '2026-01-03',
        type: 'borrow',
        amount: 5_000_000n * BigInt(1e6),
        collateral: 257_500n,
        status: 'completed',
        txHash: '0x9876...5432',
    },
];

export default function MyLoansPage() {
    const router = useRouter();
    const { isConnected } = useAccount();
    const activeLoan = useActiveLoan();
    const { balance: idrxBalance } = useIDRXBalance();
    const repay = useRepay();

    const [showRepayModal, setShowRepayModal] = useState(false);

    // Refs for animations
    const containerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const activeLoanRef = useRef<HTMLDivElement>(null);
    const historyRef = useRef<HTMLDivElement>(null);

    // Redirect to landing page if wallet disconnects
    useEffect(() => {
        if (!isConnected) {
            router.push('/');
        }
    }, [isConnected, router]);

    // Handle repay success
    useEffect(() => {
        if (repay.isSuccess) {
            setShowRepayModal(false);
            activeLoan.refetch();
            repay.reset();
        }
    }, [repay.isSuccess, activeLoan.refetch, repay.reset]);

    // GSAP Animations
    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            // Animate Header
            gsap.from(headerRef.current, {
                y: -30,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });

            // Animate Active Loan Section
            gsap.from(activeLoanRef.current, {
                y: 30,
                opacity: 0,
                duration: 1,
                delay: 0.3,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: activeLoanRef.current,
                    start: 'top 80%',
                }
            });

            // Animate History Section
            gsap.from(historyRef.current, {
                y: 30,
                opacity: 0,
                duration: 1,
                delay: 0.5,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: historyRef.current,
                    start: 'top 80%',
                }
            });

            // Stagger animation for history items
            const historyItems = document.querySelectorAll('.history-item');
            if (historyItems.length > 0) {
                gsap.from(historyItems, {
                    y: 20,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: historyRef.current,
                        start: 'top 75%',
                    }
                });
            }
        }, containerRef);

        return () => ctx.revert();
    }, [mockLoanHistory, activeLoan.hasActiveLoan]);

    if (!isConnected) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-800">
                        <Wallet className="w-8 h-8 text-white/50" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Wallet Not Connected</h1>
                    <p className="text-white/60 text-lg">
                        Please connect your wallet to view your loan dashboard.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="min-h-screen bg-black py-16 px-4 pb-24 md:pb-16 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-5xl mx-auto space-y-12 relative z-10">
                {/* Header */}
                <div ref={headerRef} className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/50 border border-yellow-500/20 mb-4 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                        <span className="text-xs font-medium text-yellow-400 uppercase tracking-widest">Dashboard</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                        Your Portfolio
                    </h1>
                    <p className="text-white/60 text-lg max-w-2xl mx-auto">
                        Track your active positions and review your transaction history in real-time.
                    </p>
                </div>

                {/* Verification Banner */}
                <VerificationBanner />

                {/* Active Loan Section */}
                <div ref={activeLoanRef} className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-500/10 rounded-lg">
                            <Briefcase className="w-6 h-6 text-yellow-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">
                            Active Position
                        </h2>
                    </div>

                    {activeLoan.hasActiveLoan ? (
                        <ActiveLoanCard
                            collateral={activeLoan.collateral}
                            debt={activeLoan.debt}
                            collateralValue={activeLoan.collateralValue}
                            ltv={activeLoan.ltv}
                            onRepayClick={() => setShowRepayModal(true)}
                            isLoading={activeLoan.isLoading}
                        />
                    ) : (
                        <div className="group relative overflow-hidden rounded-3xl bg-zinc-900/50 border border-zinc-800 p-8 md:p-12 text-center backdrop-blur-md transition-all hover:border-yellow-500/30">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-yellow-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10 flex flex-col items-center">
                                <div className="mb-8 relative">
                                    <div className="absolute inset-0 bg-yellow-400/20 blur-2xl rounded-full" />
                                    <img
                                        src="https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?q=80&w=400&auto=format&fit=crop"
                                        alt="Peace of mind"
                                        className="relative w-32 h-32 object-cover rounded-2xl shadow-2xl border-2 border-yellow-500/20 rotate-3 group-hover:rotate-6 transition-transform duration-500"
                                    />
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-3">No Active Loans</h3>
                                <p className="text-white/60 max-w-md mx-auto mb-8 leading-relaxed">
                                    You currently have no open positions. Leverage your gold assets instantly whenever you need liquidity.
                                </p>

                                <a
                                    href="/cash-loan"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold rounded-xl transition-all shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:-translate-y-1"
                                >
                                    <span>Get a Cash Loan</span>
                                    <TrendingUp className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {/* Loan History Section */}
                <div ref={historyRef} className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-500/10 rounded-lg">
                            <History className="w-6 h-6 text-yellow-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">
                            Transaction History
                        </h2>
                    </div>

                    {mockLoanHistory.length > 0 ? (
                        <div className="grid gap-4">
                            {mockLoanHistory.map((loan) => (
                                <div
                                    key={loan.id}
                                    className="history-item group bg-zinc-900/30 border border-white/5 rounded-2xl p-5 hover:bg-zinc-900/50 hover:border-yellow-500/30 transition-all duration-300"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        {/* Left: Icon & Type */}
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${loan.type === 'borrow'
                                                    ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 text-yellow-400'
                                                    : 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-400'
                                                }`}>
                                                {loan.type === 'borrow' ? <TrendingDown className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-white font-bold text-lg">
                                                        {loan.type === 'borrow' ? 'Loan Disbursed' : 'Repayment Completed'}
                                                    </h3>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${loan.status === 'completed'
                                                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                            : loan.status === 'pending'
                                                                ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                        }`}>
                                                        {loan.status}
                                                    </span>
                                                </div>
                                                <p className="text-zinc-500 text-sm flex items-center gap-1.5 mt-0.5">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {new Date(loan.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Right: Amount & Collateral */}
                                        <div className="flex items-center justify-between md:justify-end md:gap-8 flex-1">
                                            <div className="text-right">
                                                <p className={`font-bold text-lg ${loan.type === 'borrow' ? 'text-white' : 'text-green-400'}`}>
                                                    {loan.type === 'borrow' ? '+' : '-'}{formatRupiah(loan.amount)}
                                                </p>
                                                <p className="text-zinc-500 text-sm">
                                                    Collateral: <span className="text-zinc-300">{formatXAUT(loan.collateral)} XAUT</span>
                                                </p>
                                            </div>

                                            <a
                                                href={`https://sepolia.mantlescan.xyz/tx/${loan.txHash}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
                                                title="View Transaction"
                                            >
                                                <ExternalLink className="w-5 h-5" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-3xl bg-zinc-900/30 border border-dashed border-zinc-800 p-12 text-center">
                            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                <History className="w-8 h-8 text-zinc-600" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No History Yet</h3>
                            <p className="text-white/50 max-w-sm mx-auto">
                                Your past loan transactions will appear here once you start using the platform.
                            </p>
                        </div>
                    )}
                </div>

                {/* Repay Modal */}
                <RepayModal
                    isOpen={showRepayModal}
                    onClose={() => setShowRepayModal(false)}
                    debt={activeLoan.debt}
                    collateral={activeLoan.collateral}
                    idrxBalance={idrxBalance}
                    onRepay={(repayAmount, isFullRepay) => {
                        // Execute repay - if full repay, withdraw all collateral; otherwise withdraw 0
                        const withdrawAmount = isFullRepay ? activeLoan.collateral : 0n;
                        repay.execute(repayAmount, withdrawAmount);
                    }}
                    isProcessing={repay.isPending || repay.isConfirming}
                />
            </div>
        </div>
    );
}
