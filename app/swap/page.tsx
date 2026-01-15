'use client';

import { useState, useRef } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowDownUp, RefreshCw } from 'lucide-react';
import { TOKENS } from '@/lib/contracts/tokens';
import { MANTLE_CONTRACTS as CONTRACTS } from '@/lib/contracts/mantle_addresses';
import { useTokenBalance } from '@/hooks/contracts/useTokenBalance';
import { useTokenAllowance } from '@/hooks/contracts/useTokenAllowance';
import { useTokenApproval } from '@/hooks/contracts/useTokenApproval';
import { useSwapRouter } from '@/hooks/contracts/useSwapRouter';
import { useIdentityRegistry } from '@/hooks/contracts/useIdentityRegistry';
import { parseTokenAmount, formatTokenAmount, getExplorerTxUrl } from '@/lib/utils/format';
import { calculateMinimumReceived } from '@/lib/utils/calculations';
import { isValidAmount } from '@/lib/utils/validation';
import { DEFAULT_SLIPPAGE_BPS } from '@/lib/utils/constants';
import { VerificationBanner } from '@/components/shared/VerificationBanner';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function SwapPage() {
    const { address, isConnected } = useAccount();
    const [fromToken, setFromToken] = useState<'IDRX' | 'XAUT'>('IDRX');
    const [toToken, setToToken] = useState<'IDRX' | 'XAUT'>('XAUT');
    const [inputAmount, setInputAmount] = useState('');
    const [slippageBps, setSlippageBps] = useState(DEFAULT_SLIPPAGE_BPS);

    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            defaults: { ease: 'power3.out' }
        });

        tl.from(titleRef.current, {
            y: -30,
            opacity: 0,
            duration: 1,
            delay: 0.2
        })
            .from(cardRef.current, {
                y: 50,
                opacity: 0,
                duration: 1,
                scale: 0.95
            }, '-=0.5')
            .from('.swap-element', {
                y: 20,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1
            }, '-=0.5');

    }, { scope: containerRef });

    // Check verification status
    const { useIsVerified } = useIdentityRegistry();
    const { data: isVerified } = useIsVerified(address);

    // Get token balances
    const { data: fromBalance } = useTokenBalance(
        fromToken === 'IDRX' ? TOKENS.IDRX.address : TOKENS.XAUT.address,
        address
    ) as { data: bigint | undefined };

    // Parse input amount
    const parsedAmount = inputAmount && isValidAmount(inputAmount)
        ? parseTokenAmount(inputAmount, TOKENS[fromToken].decimals)
        : BigInt(0);

    // Get quote
    const swapRouter = useSwapRouter();
    const quoteHook = fromToken === 'IDRX'
        ? swapRouter.useQuoteIDRXtoXAUT(parsedAmount)
        : swapRouter.useQuoteXAUTtoIDRX(parsedAmount);

    const outputAmount = (quoteHook.data as bigint) || BigInt(0);

    // Check allowance
    const { data: allowance } = useTokenAllowance(
        fromToken === 'IDRX' ? TOKENS.IDRX.address : TOKENS.XAUT.address,
        address,
        CONTRACTS.SwapRouter
    );

    const needsApproval = allowance !== undefined && allowance !== null && typeof allowance === 'bigint' && parsedAmount > BigInt(0) && allowance < parsedAmount;

    // Approval hook
    const approval = useTokenApproval(
        fromToken === 'IDRX' ? TOKENS.IDRX.address : TOKENS.XAUT.address
    );

    // Handle switch tokens
    const handleSwitch = () => {
        // Animate switch icon
        gsap.to('.switch-icon', {
            rotation: '+=180',
            duration: 0.4,
            ease: 'back.out(1.7)'
        });

        setFromToken(toToken);
        setToToken(fromToken);
        setInputAmount('');
    };

    // Handle max button
    const handleMax = () => {
        if (fromBalance) {
            setInputAmount(formatTokenAmount(fromBalance, TOKENS[fromToken].decimals, 6));
        }
    };

    // Handle approve
    const handleApprove = () => {
        approval.approve(CONTRACTS.SwapRouter);
    };

    // Handle swap
    const handleSwap = () => {
        if (!address || !parsedAmount || !outputAmount) return;

        const minOutput = calculateMinimumReceived(outputAmount, slippageBps);

        if (fromToken === 'IDRX') {
            swapRouter.swapIDRXtoXAUT(parsedAmount, minOutput, address);
        } else {
            swapRouter.swapXAUTtoIDRX(parsedAmount, minOutput, address);
        }
    };

    // Determine button state
    const getButtonContent = () => {
        if (!isConnected) return 'Connect Wallet';
        if (!isVerified) return 'Verification Required';
        if (!inputAmount || !isValidAmount(inputAmount)) return 'Enter Amount';
        if (fromBalance && parsedAmount > fromBalance) return 'Insufficient Balance';
        if (needsApproval) {
            if (approval.isPending || approval.isConfirming)
                return <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Approving...</span>;
            return `Approve ${fromToken}`;
        }
        if (swapRouter.isPending || swapRouter.isConfirming)
            return <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Swapping...</span>;
        return 'Swap Now';
    };

    const isButtonDisabled = () => {
        if (!isConnected) return false;
        if (!isVerified) return true;
        if (!inputAmount || !isValidAmount(inputAmount)) return true;
        if (fromBalance && parsedAmount > fromBalance) return true;
        if (approval.isPending || approval.isConfirming) return true;
        if (swapRouter.isPending || swapRouter.isConfirming) return true;
        return false;
    };

    const handleButtonClick = () => {
        if (!isConnected) {
            // User should use wallet button in header
            return;
        }
        if (needsApproval) {
            handleApprove();
        } else {
            handleSwap();
        }
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-black py-10 md:py-20 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-yellow-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-xl mx-auto">
                    {/* Page Title */}
                    <div ref={titleRef} className="text-center mb-10">
                        <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent mb-4 tracking-tight drop-shadow-sm">
                            Instant Gold Exchange
                        </h1>
                        <p className="text-lg text-white/60 font-light max-w-sm mx-auto leading-relaxed">
                            Seamlessly swap between Digital Rupiah and Gold Tokens with zero friction.
                        </p>
                    </div>

                    {/* Verification Banner */}
                    <div className="swap-element mb-6">
                        <VerificationBanner />
                    </div>

                    {/* Main Swap Card */}
                    <div ref={cardRef} className="p-1 rounded-3xl bg-linear-to-b from-yellow-500/20 to-transparent shadow-2xl shadow-yellow-900/10">
                        <div className="p-4 md:p-8 rounded-[22px] bg-zinc-900/90 border border-white/5 backdrop-blur-xl">
                            <div className="space-y-6">
                                {/* From Token */}
                                <div className="space-y-3 swap-element">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span className="text-white/60">From Asset</span>
                                        <span className="text-yellow-500/80 bg-yellow-500/5 px-2 py-0.5 rounded text-xs">
                                            Balance: {fromBalance ? formatTokenAmount(fromBalance, TOKENS[fromToken].decimals, 4) : '0.0000'}
                                        </span>
                                    </div>
                                    <div className="group bg-black/50 p-4 rounded-xl border border-white/10 hover:border-yellow-500/30 transition-colors duration-300">
                                        <div className="flex gap-4 items-center">
                                            <div className="flex-1">
                                                <Input
                                                    type="text"
                                                    placeholder="0.00"
                                                    value={inputAmount}
                                                    onChange={(e) => setInputAmount(e.target.value)}
                                                    className="w-full bg-transparent border-none text-2xl md:text-3xl font-bold p-0 h-auto focus-visible:ring-0 placeholder:text-white/20 text-white"
                                                />
                                            </div>
                                            <div className="flex items-center gap-3 bg-zinc-800/80 px-4 py-2 rounded-lg border border-white/5 shadow-inner">
                                                {/* Token Icon */}
                                                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 relative">
                                                    <img
                                                        src={fromToken === 'IDRX'
                                                            ? "data:image/jpeg;base64,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"
                                                            : "data:image/jpeg;base64,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"}
                                                        alt={fromToken}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <span className="font-bold text-lg text-white">{fromToken}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-xs text-white/40">≈ $0.00 USD</span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleMax}
                                                className="h-6 text-xs text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10 uppercase tracking-wider font-semibold"
                                            >
                                                Max Amount
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Switch Button */}
                                <div className="relative h-4 swap-element">
                                    <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={handleSwitch}
                                            className="h-12 w-12 rounded-full border-4 border-zinc-900 bg-zinc-800 text-yellow-500 hover:bg-zinc-700 hover:text-yellow-400 hover:border-zinc-900 transition-all duration-300 shadow-lg group"
                                        >
                                            <ArrowDownUp className="h-5 w-5 switch-icon group-hover:scale-110 transition-transform" />
                                        </Button>
                                    </div>
                                </div>

                                {/* To Token */}
                                <div className="space-y-3 swap-element">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span className="text-white/60">To Asset</span>
                                    </div>
                                    <div className="bg-zinc-950/50 p-4 rounded-xl border border-white/5">
                                        <div className="flex gap-4 items-center">
                                            <div className="flex-1">
                                                <Input
                                                    type="text"
                                                    placeholder="0.00"
                                                    value={outputAmount ? formatTokenAmount(outputAmount, TOKENS[toToken].decimals, 4) : ''}
                                                    disabled
                                                    className="w-full bg-transparent border-none text-2xl md:text-3xl font-bold p-0 h-auto text-white/50"
                                                />
                                            </div>
                                            <div className="flex items-center gap-3 bg-zinc-900 px-4 py-2 rounded-lg border border-white/5">
                                                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 relative">
                                                    <img
                                                        src={toToken === 'IDRX'
                                                            ? "data:image/jpeg;base64,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"
                                                            : "data:image/jpeg;base64,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"}
                                                        alt={toToken}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <span className="font-bold text-lg text-white">{toToken}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quote Details */}
                                {outputAmount > BigInt(0) && (
                                    <div className="swap-element space-y-3 p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-xl text-sm">
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/60 flex items-center gap-1.5">
                                                Exchange Rate
                                                <div className="group relative cursor-help">
                                                    <span className="text-[10px] w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-white/40">?</span>
                                                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black/90 border border-white/10 rounded text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                        Based on Uniswap V2 pool reserves
                                                    </span>
                                                </div>
                                            </span>
                                            <span className="text-white font-mono text-xs">
                                                {outputAmount && parsedAmount ? (() => {
                                                    const rate = Number(outputAmount) / Number(parsedAmount);
                                                    if (rate < 0.0001) {
                                                        const invertedRate = Number(parsedAmount) / Number(outputAmount);
                                                        return `1 ${toToken} ≈ ${invertedRate.toFixed(2)} ${fromToken}`;
                                                    }
                                                    return `1 ${fromToken} ≈ ${rate.toFixed(6)} ${toToken}`;
                                                })() : 'Loading...'}
                                            </span>
                                        </div>
                                        <div className="w-full h-px bg-yellow-500/10" />
                                        <div className="flex justify-between text-xs">
                                            <span className="text-white/60">Slippage Tolerance</span>
                                            <span className="text-white">{(slippageBps / 100).toFixed(2)}%</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-white/60">Minimum Received</span>
                                            <span className="text-white font-medium">
                                                {formatTokenAmount(
                                                    calculateMinimumReceived(outputAmount, slippageBps),
                                                    TOKENS[toToken].decimals,
                                                    4
                                                )} {toToken}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Swap Button */}
                                <div className="swap-element pt-2">
                                    <Button
                                        className="w-full h-12 md:h-14 text-base md:text-lg bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 hover:from-yellow-400 hover:to-amber-400 text-black font-bold rounded-xl shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.99]"
                                        onClick={handleButtonClick}
                                        disabled={isButtonDisabled()}
                                    >
                                        {getButtonContent()}
                                    </Button>
                                </div>

                                {/* Transaction Status Messages */}
                                {(approval.isSuccess || swapRouter.isSuccess || approval.error || swapRouter.error) && (
                                    <div className="swap-element pt-2">
                                        {/* Approval Success */}
                                        {approval.isSuccess && approval.hash && !swapRouter.isSuccess && (
                                            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-sm flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-green-400">Approval Successful</p>
                                                    <a
                                                        href={getExplorerTxUrl(approval.hash)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-white/40 hover:text-white/80 text-xs flex items-center gap-1 mt-0.5 transition-colors"
                                                    >
                                                        View on Explorer
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {/* Swap Success */}
                                        {swapRouter.isSuccess && swapRouter.hash && (
                                            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-sm flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-green-400">Swap Completed Successfully!</p>
                                                    <a
                                                        href={getExplorerTxUrl(swapRouter.hash)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-white/40 hover:text-white/80 text-xs flex items-center gap-1 mt-0.5 transition-colors"
                                                    >
                                                        View on Explorer
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {/* Errors */}
                                        {(approval.error || swapRouter.error) && (
                                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
                                                <p className="font-bold flex items-center gap-2">
                                                    <span className="text-lg">!</span> Transaction Failed
                                                </p>
                                                <p className="opacity-80 mt-1">
                                                    {(approval.error?.message || swapRouter.error?.message)?.slice(0, 100)}...
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
