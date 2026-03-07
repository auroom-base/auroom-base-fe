'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { GoldBalanceCard } from './GoldBalanceCard';
import { LoanAmountInput } from './LoanAmountInput';
import { LTVSelector } from './LTVSelector';
import { LoanSummary } from './LoanSummary';
import { PreflightCard } from './PreflightCard';
import { useSimulateDeposit } from '@/hooks/useSimulateDeposit';
import { Loader2, ChevronDown, ChevronUp, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRupiah } from '@/lib/utils/format';

// usdToIdr FX rate (keep in sync with config.staging.json)
const USD_TO_IDR = 16_774.66;

interface AmountStepProps {
    // Gold data
    goldBalance: bigint;
    goldValue: bigint;
    goldPrice: bigint;
    goldLoading: boolean;

    // Loan input
    loanInput: string;
    onLoanInputChange: (value: string) => void;

    // LTV
    selectedLTV: number;
    onLTVChange: (ltv: number) => void;

    // Calculation
    calculation: {
        loanAmount: bigint;
        collateralRequired: bigint;
        collateralValue: bigint;
        fee: bigint;
        amountReceived: bigint;
        maxLoan: bigint;
        isValid: boolean;
        errorMessage?: string;
    };

    // Approval
    needsApproval: boolean;
    onApprove: () => void;
    approvalPending: boolean;
    approvalConfirming: boolean;

    // Continue
    onContinue: () => void;
    continuePending: boolean;
    continueConfirming: boolean;

    // Disabled state
    disabled?: boolean;
}

export function AmountStep({
    goldBalance,
    goldValue,
    goldPrice,
    goldLoading,
    loanInput,
    onLoanInputChange,
    selectedLTV,
    onLTVChange,
    calculation,
    needsApproval,
    onApprove,
    approvalPending,
    approvalConfirming,
    onContinue,
    continuePending,
    continueConfirming,
    disabled,
}: AmountStepProps) {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const { address } = useAccount();

    const loanAmount = loanInput ? BigInt(loanInput) * BigInt(1e6) : 0n;
    const isFormValid = loanAmount > 0n && calculation.isValid;
    const isProcessing = approvalPending || approvalConfirming || continuePending || continueConfirming;

    // Pre-flight simulation — only runs once XAUT is approved.
    // Skipped when needsApproval=true because depositAndBorrow would always
    // revert with ERC20InsufficientAllowance before approval, which is misleading.
    const simulation = useSimulateDeposit(
        needsApproval ? undefined : address,
        calculation.collateralRequired,
        loanAmount,
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Gold Balance Card */}
            <GoldBalanceCard
                balance={goldBalance}
                balanceValue={goldValue}
                maxLoan={calculation.maxLoan}
                xautPrice={goldPrice}
                isLoading={goldLoading}
            />

            {/* Live Gold Rate */}
            {goldPrice > 0n && (
                <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-900/80 border border-yellow-500/20">
                    <div className="flex items-center gap-2">
                        {/* pulsing live dot */}
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                        </span>
                        <span className="text-white/60 text-xs">Live Rate</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            ⬡ Chainlink CRE
                        </span>
                    </div>
                    <div className="text-right">
                        <p className="text-yellow-400 font-semibold text-sm">
                            1 XAUT = {formatRupiah(goldPrice / 100n)}
                        </p>
                        <p className="text-white/40 text-xs">
                            ≈ ${(Number(goldPrice) / 1e8 / USD_TO_IDR).toLocaleString('en-US', { maximumFractionDigits: 2 })} USD
                        </p>
                    </div>
                </div>
            )}

            {/* Loan Amount Input */}
            <LoanAmountInput
                value={loanInput}
                onChange={onLoanInputChange}
                maxLoan={calculation.maxLoan}
                disabled={disabled || isProcessing}
            />

            {/* Advanced Settings - Collapsible */}
            <div className="rounded-2xl bg-zinc-900 border-2 border-yellow-500/30 overflow-hidden transition-all duration-300">
                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    disabled={disabled || isProcessing}
                    className={cn(
                        "w-full p-4 flex items-center justify-between",
                        "hover:bg-yellow-500/5 transition-colors",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <Settings className="w-5 h-5 text-yellow-500" />
                        <div className="text-left">
                            <p className="text-white font-semibold">Advanced Settings</p>
                            <p className="text-white/50 text-sm">
                                {showAdvanced
                                    ? 'Customize your loan safety level'
                                    : `Using recommended ${selectedLTV}% safety level`
                                }
                            </p>
                        </div>
                    </div>
                    {showAdvanced ? (
                        <ChevronUp className="w-5 h-5 text-white/50" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-white/50" />
                    )}
                </button>

                {/* Collapsible Content */}
                <div
                    className={cn(
                        "transition-all duration-300 ease-in-out overflow-hidden",
                        showAdvanced ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                    )}
                >
                    <div className="p-4 pt-0 border-t border-yellow-500/20">
                        <LTVSelector
                            selectedLTV={selectedLTV}
                            onLTVChange={onLTVChange}
                            disabled={disabled || isProcessing}
                        />
                    </div>
                </div>
            </div>

            {/* Loan Summary */}
            <LoanSummary
                calculation={calculation}
                bankId=""
                accountNumber=""
                xautPrice={goldPrice}
            />

            {/* Error Message */}
            {calculation.errorMessage && loanAmount > 0n && (
                <div className="p-4 rounded-xl bg-red-500/10 border-2 border-red-500/50 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-red-400 text-center font-semibold">
                        ⚠️ {calculation.errorMessage}
                    </p>
                </div>
            )}

            {/* Pre-flight Simulation — only show after XAUT is approved */}
            {isFormValid && !needsApproval && (
                <PreflightCard result={simulation} />
            )}

            {/* Action Button */}
            <div className="space-y-3">
                {needsApproval ? (
                    <Button
                        onClick={onApprove}
                        disabled={disabled || approvalPending || approvalConfirming}
                        className="w-full h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold text-lg shadow-lg shadow-yellow-500/20 transition-all hover:shadow-yellow-500/40"
                    >
                        {approvalPending || approvalConfirming ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                {approvalPending ? 'Approving Gold Access...' : 'Confirming Approval...'}
                            </>
                        ) : (
                            '🔓 Approve Gold Access'
                        )}
                    </Button>
                ) : (
                    <Button
                        onClick={onContinue}
                        disabled={!isFormValid || disabled || continuePending || continueConfirming}
                        className="w-full h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold text-xl shadow-lg shadow-yellow-500/20 transition-all hover:shadow-yellow-500/40 disabled:opacity-50"
                    >
                        {continuePending || continueConfirming ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                {continuePending ? 'Securing Gold...' : 'Confirming Transaction...'}
                            </>
                        ) : (
                            <>💸 Continue - Get {formatRupiah(calculation.amountReceived)}</>
                        )}
                    </Button>
                )}

                <p className="text-center text-sm text-white/60">
                    {needsApproval
                        ? '🔒 First, we need permission to secure your gold as collateral'
                        : 'ⓘ Your gold will be secured automatically. You can repay anytime to get it back.'
                    }
                </p>
            </div>
        </div>
    );
}
