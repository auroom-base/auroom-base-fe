'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAccount } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { useTokenBalance } from '@/hooks/contracts/useTokenBalance';
import { useXAUTAllowanceV2, useXAUTApproveV2 } from '@/hooks/contracts/useTokenApprovalsV2';
import { useDepositAndBorrow, useXAUTPriceV2, useBorrowFeeV2 } from '@/hooks/contracts/useBorrowingProtocolV2';
import { BASE_CONTRACTS as CONTRACTS } from '@/lib/contracts/base_addresses';
import { Loader2, Zap, CheckCircle2 } from 'lucide-react';
import { LTVSelector } from './LTVSelector';
import { BorrowSummaryV2 } from './BorrowSummaryV2';
import { InsufficientBalanceAlert } from './InsufficientBalanceAlert';
import { SuccessModal } from '../instant-borrow/SuccessModal';
import { calculateInstantBorrow, calculateMaxBorrowForLTV, hasSufficientBalance } from '@/lib/utils/instantBorrowCalculations';
import { DEFAULT_LTV } from '@/lib/config/ltvPresets';

interface BorrowFormV2Props {
    onSuccess: () => void;
}

export function BorrowFormV2({ onSuccess }: BorrowFormV2Props) {
    const { address } = useAccount();
    const [borrowInput, setBorrowInput] = useState('');
    const [selectedLTV, setSelectedLTV] = useState(DEFAULT_LTV); // 30% default
    const [showSuccess, setShowSuccess] = useState(false);

    // Get XAUT balance and price
    const { data: xautBalance } = useTokenBalance(CONTRACTS.XAUT, address);
    const { data: xautPrice } = useXAUTPriceV2();
    const { data: feeBps } = useBorrowFeeV2();

    // Get allowance and approval
    const { data: allowance, refetch: refetchAllowance } = useXAUTAllowanceV2();
    const approveXAUT = useXAUTApproveV2();

    // Borrow hook
    const depositAndBorrow = useDepositAndBorrow();

    // Parse borrow input
    const borrowAmount = borrowInput ? parseUnits(borrowInput, 6) : BigInt(0);

    // Calculate everything
    const calculation = calculateInstantBorrow(
        borrowAmount,
        selectedLTV,
        (xautPrice as bigint) || BigInt(0),
        Number((feeBps as bigint) || 50n)
    );

    // Check balance
    const hasEnoughBalance = hasSufficientBalance(
        calculation.collateralRequired,
        (xautBalance as bigint) || BigInt(0)
    );

    // Check approval
    const needsApproval = allowance !== undefined && calculation.collateralRequired > (allowance as bigint);

    // Calculate max borrow for current LTV
    const maxBorrow = calculateMaxBorrowForLTV(
        (xautBalance as bigint) || BigInt(0),
        (xautPrice as bigint) || BigInt(0),
        selectedLTV
    );

    // Format functions
    const formatIDR = (value: bigint | undefined) => {
        if (!value) return 'Rp 0';
        const num = Number(formatUnits(value, 6));
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(num);
    };

    const formatXAUT = (value: bigint | undefined) => {
        if (!value) return '0.00';
        return Number(formatUnits(value, 6)).toFixed(2);
    };

    // Handle quick amounts
    const handleQuickAmount = (amount: bigint) => {
        setBorrowInput(formatUnits(amount, 6));
    };

    // Handle MAX
    const handleMax = () => {
        setBorrowInput(formatUnits(maxBorrow, 6));
    };

    // Handle approve
    const handleApprove = () => {
        approveXAUT.approve(BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'));
    };

    // Handle borrow
    const handleBorrow = () => {
        depositAndBorrow.execute(calculation.collateralRequired, borrowAmount);
    };

    // Refetch allowance after approval
    useEffect(() => {
        if (approveXAUT.isSuccess) {
            refetchAllowance();
        }
    }, [approveXAUT.isSuccess, refetchAllowance]);

    // Show success modal after borrow
    useEffect(() => {
        if (depositAndBorrow.isSuccess) {
            setShowSuccess(true);
            onSuccess();
            setBorrowInput('');
            depositAndBorrow.reset();
        }
    }, [depositAndBorrow.isSuccess, onSuccess, depositAndBorrow]);

    const isFormValid = borrowAmount > BigInt(0);
    const canBorrow = isFormValid && hasEnoughBalance;

    return (
        <div className="space-y-6">
            {/* Borrow Amount Input */}
            <div className="p-6 rounded-2xl bg-zinc-900 border-2 border-yellow-500/30">
                <h3 className="text-lg font-semibold text-white mb-4">💰 Berapa yang ingin kamu pinjam?</h3>

                <div className="space-y-3">
                    <Input
                        type="number"
                        placeholder="0"
                        value={borrowInput}
                        onChange={(e) => setBorrowInput(e.target.value)}
                        className="bg-black/40 border-yellow-500/30 text-white text-2xl h-16 text-center font-bold"
                    />

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Saldo XAUT:</span>
                        <span className="text-white font-semibold">
                            {formatXAUT(xautBalance as bigint)} (~{formatIDR(maxBorrow)} tersedia)
                        </span>
                    </div>

                    {/* Quick Amount Buttons */}
                    <div className="grid grid-cols-5 gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuickAmount(parseUnits('1000000', 6))}
                            className="border-yellow-500/30 hover:bg-yellow-500/10 text-xs"
                        >
                            Rp 1jt
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuickAmount(parseUnits('10000000', 6))}
                            className="border-yellow-500/30 hover:bg-yellow-500/10 text-xs"
                        >
                            Rp 10jt
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuickAmount(parseUnits('50000000', 6))}
                            className="border-yellow-500/30 hover:bg-yellow-500/10 text-xs"
                        >
                            Rp 50jt
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuickAmount(parseUnits('100000000', 6))}
                            className="border-yellow-500/30 hover:bg-yellow-500/10 text-xs"
                        >
                            Rp 100jt
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleMax}
                            className="border-yellow-500/30 hover:bg-yellow-500/10 font-bold"
                        >
                            MAX
                        </Button>
                    </div>
                </div>
            </div>

            {/* LTV Selector */}
            <div className="p-6 rounded-2xl bg-zinc-900 border-2 border-yellow-500/30">
                <LTVSelector
                    value={selectedLTV}
                    onChange={setSelectedLTV}
                    disabled={!isFormValid}
                />
            </div>

            {/* Borrow Summary */}
            <BorrowSummaryV2
                calculation={calculation}
                xautPrice={(xautPrice as bigint) || BigInt(0)}
                isLoading={false}
            />

            {/* Insufficient Balance Alert */}
            {isFormValid && !hasEnoughBalance && (
                <InsufficientBalanceAlert
                    required={calculation.collateralRequired}
                    balance={(xautBalance as bigint) || BigInt(0)}
                />
            )}

            {/* Action Button */}
            <div className="space-y-3">
                {needsApproval ? (
                    <Button
                        onClick={handleApprove}
                        disabled={approveXAUT.isPending || approveXAUT.isConfirming}
                        className="w-full h-14 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold text-lg"
                    >
                        {approveXAUT.isPending || approveXAUT.isConfirming ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                {approveXAUT.isPending ? 'Approving...' : 'Confirming...'}
                            </>
                        ) : approveXAUT.isSuccess ? (
                            <>
                                <CheckCircle2 className="w-5 h-5 mr-2" />
                                Approved! Click Borrow
                            </>
                        ) : (
                            'Approve XAUT'
                        )}
                    </Button>
                ) : (
                    <Button
                        onClick={handleBorrow}
                        disabled={!canBorrow || depositAndBorrow.isPending || depositAndBorrow.isConfirming}
                        className="w-full h-14 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold text-lg"
                    >
                        {depositAndBorrow.isPending || depositAndBorrow.isConfirming ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                {depositAndBorrow.isPending ? 'Borrowing...' : 'Confirming...'}
                            </>
                        ) : (
                            <>
                                <Zap className="w-5 h-5 mr-2" />
                                PINJAM SEKARANG - Terima {formatIDR(calculation.amountReceived)}
                            </>
                        )}
                    </Button>
                )}

                <p className="text-center text-sm text-white/60">
                    ⓘ Setelah pinjam, lanjut ke tab Redeem untuk cairkan ke bank
                </p>
            </div>

            {/* Success Modal */}
            <SuccessModal
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                type="borrow"
                data={{
                    amount: formatIDR(calculation.amountReceived),
                    fee: formatIDR(calculation.fee),
                    txHash: depositAndBorrow.hash,
                }}
                onContinue={() => {
                    setShowSuccess(false);
                }}
            />
        </div>
    );
}
