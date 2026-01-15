'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTokenBalance } from '@/hooks/contracts/useTokenBalance';
import { useIDRXAllowance, useIDRXApprove } from '@/hooks/contracts/useXAUTApproval';
import { useBorrow, useRepay, useRepayFull, usePreviewBorrow } from '@/hooks/contracts/useBorrowingProtocol';
import { MANTLE_CONTRACTS as CONTRACTS } from '@/lib/contracts/mantle_addresses';
import { parseAmount, formatAmount, formatIDR, formatLTV } from '@/lib/utils/borrow';
import { useToast } from '@/hooks/use-toast';

interface BorrowCardProps {
    maxBorrow: bigint;
    currentDebt: bigint;
    onSuccess?: () => void;
}

export function BorrowCard({ maxBorrow, currentDebt, onSuccess }: BorrowCardProps) {
    const { address } = useAccount();
    const { toast } = useToast();
    const [mode, setMode] = useState<'borrow' | 'repay'>('borrow');
    const [amount, setAmount] = useState('');

    // Get IDRX balance
    const { data: idrxBalance } = useTokenBalance(CONTRACTS.IDRX, address) as { data: bigint | undefined };

    // Parse amount
    const parsedAmount = amount ? parseAmount(amount, 6) : 0n;

    // Approval hooks (for repay)
    const { data: allowance } = useIDRXAllowance();
    const approval = useIDRXApprove();

    // Transaction hooks
    const borrow = useBorrow();
    const repay = useRepay();
    const repayFull = useRepayFull();

    // Preview borrow - returns [amountAfterFee, fee, newLTV]
    const { data: borrowPreview } = usePreviewBorrow(parsedAmount);

    const needsApproval = mode === 'repay' && allowance !== undefined && allowance !== null && parsedAmount > 0n && (allowance as bigint) < parsedAmount;

    // Handle success
    useEffect(() => {
        if (borrow.isSuccess) {
            toast({
                title: 'Borrow Successful!',
                description: `Successfully borrowed ${amount} IDRX`,
            });
            setAmount('');
            onSuccess?.();
        }
        if (repay.isSuccess || repayFull.isSuccess) {
            toast({
                title: 'Repayment Successful!',
                description: `Successfully repaid ${mode === 'repay' ? amount : 'all'} IDRX`,
            });
            setAmount('');
            onSuccess?.();
        }
    }, [borrow.isSuccess, repay.isSuccess, repayFull.isSuccess]);

    // Handle errors
    useEffect(() => {
        if (borrow.error) {
            toast({
                title: 'Borrow Failed',
                description: borrow.error.message,
                variant: 'destructive',
            });
        }
        if (repay.error) {
            toast({
                title: 'Repay Failed',
                description: repay.error.message,
                variant: 'destructive',
            });
        }
        if (repayFull.error) {
            toast({
                title: 'Repay Failed',
                description: repayFull.error.message,
                variant: 'destructive',
            });
        }
        if (approval.error) {
            toast({
                title: 'Approval Failed',
                description: approval.error.message,
                variant: 'destructive',
            });
        }
    }, [borrow.error, repay.error, repayFull.error, approval.error]);

    const handleMax = () => {
        if (mode === 'borrow' && maxBorrow) {
            setAmount(formatAmount(maxBorrow, 6));
        } else if (mode === 'repay' && currentDebt) {
            setAmount(formatAmount(currentDebt, 6));
        }
    };

    const handleApprove = () => {
        if (parsedAmount > 0n) {
            approval.approve(parsedAmount);
        }
    };

    const handleBorrow = () => {
        if (parsedAmount > 0n) {
            borrow.borrow(parsedAmount);
        }
    };

    const handleRepay = () => {
        if (parsedAmount > 0n) {
            repay.repay(parsedAmount);
        }
    };

    const handleRepayFull = () => {
        repayFull.repayFull();
    };

    const getButtonContent = () => {
        if (!address) return 'Connect Wallet';
        if (!amount || parsedAmount === 0n) return 'Enter Amount';

        if (mode === 'borrow') {
            if (maxBorrow && parsedAmount > maxBorrow) return 'Exceeds Max Borrow';
            if (borrowPreview && (borrowPreview as [bigint, bigint, bigint])[2] > 7500n) return 'Would Exceed Max LTV';
            if (borrow.isPending || borrow.isConfirming) return 'Borrowing...';
            return 'Borrow IDRX';
        } else {
            if (currentDebt && parsedAmount > currentDebt) return 'Exceeds Current Debt';
            if (idrxBalance && parsedAmount > idrxBalance) return 'Insufficient IDRX Balance';
            if (needsApproval) {
                if (approval.isPending || approval.isConfirming) return 'Approving...';
                return 'Approve IDRX';
            }
            if (repay.isPending || repay.isConfirming) return 'Repaying...';
            return 'Repay IDRX';
        }
    };

    const isButtonDisabled = () => {
        if (!address || !amount || parsedAmount === 0n) return true;
        if (mode === 'borrow' && maxBorrow && parsedAmount > maxBorrow) return true;
        if (mode === 'borrow' && borrowPreview && (borrowPreview as [bigint, bigint, bigint])[2] > 7500n) return true;
        if (mode === 'repay' && currentDebt && parsedAmount > currentDebt) return true;
        if (mode === 'repay' && idrxBalance && parsedAmount > idrxBalance) return true;
        if (approval.isPending || approval.isConfirming) return true;
        if (borrow.isPending || borrow.isConfirming) return true;
        if (repay.isPending || repay.isConfirming) return true;
        return false;
    };

    const handleButtonClick = () => {
        if (mode === 'borrow') {
            handleBorrow();
        } else {
            if (needsApproval) {
                handleApprove();
            } else {
                handleRepay();
            }
        }
    };

    return (
        <div className="p-6 rounded-2xl bg-zinc-900 border-2 border-yellow-500/30 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Borrow / Repay</h3>

            {/* Mode Toggle */}
            <div className="flex gap-2 mb-4">
                <Button
                    variant={mode === 'borrow' ? 'default' : 'outline'}
                    onClick={() => setMode('borrow')}
                    className={mode === 'borrow'
                        ? 'flex-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-black'
                        : 'flex-1 border-yellow-500/30 bg-yellow-500/10 text-yellow-400'}
                >
                    Borrow
                </Button>
                <Button
                    variant={mode === 'repay' ? 'default' : 'outline'}
                    onClick={() => setMode('repay')}
                    className={mode === 'repay'
                        ? 'flex-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-black'
                        : 'flex-1 border-yellow-500/30 bg-yellow-500/10 text-yellow-400'}
                >
                    Repay
                </Button>
            </div>

            {/* Balance Display */}
            <div className="mb-4 p-3 bg-black/50 border border-white/10 rounded-lg">
                <div className="flex justify-between text-sm">
                    <span className="text-white/60">
                        {mode === 'borrow' ? 'Max Available to Borrow' : 'Current Debt'}
                    </span>
                    <span className="text-white font-medium">
                        {mode === 'borrow'
                            ? formatIDR(maxBorrow, 6)
                            : formatIDR(currentDebt, 6)
                        }
                    </span>
                </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-2 mb-4">
                <label className="text-sm text-white/60">Amount (IDRX)</label>
                <div className="flex gap-2">
                    <Input
                        type="text"
                        placeholder="0.0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="flex-1 bg-black border-white/20 text-white placeholder:text-white/40"
                    />
                    <Button
                        variant="outline"
                        onClick={handleMax}
                        className="border-yellow-500/30 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
                    >
                        MAX
                    </Button>
                </div>
            </div>

            {/* Preview */}
            {parsedAmount > 0n && (
                <div className="mb-4 p-3 bg-black/50 border border-white/10 rounded-lg space-y-2 text-sm">
                    <p className="text-white/60 font-medium">Preview:</p>
                    {mode === 'borrow' && borrowPreview ? (
                        <>
                            <div className="flex justify-between">
                                <span className="text-white/60">Borrow Fee (0.5%)</span>
                                <span className="text-white">
                                    {formatIDR((borrowPreview as [bigint, bigint, bigint])[1], 6)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/60">You Receive</span>
                                <span className="text-yellow-400 font-medium">
                                    {formatIDR((borrowPreview as [bigint, bigint, bigint])[0], 6)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/60">New LTV</span>
                                <span className={`font-medium ${Number((borrowPreview as [bigint, bigint, bigint])[2]) > 8000 ? 'text-red-500' :
                                    Number((borrowPreview as [bigint, bigint, bigint])[2]) > 7500 ? 'text-orange-500' :
                                        'text-green-500'
                                    }`}>
                                    {formatLTV((borrowPreview as [bigint, bigint, bigint])[2])}
                                </span>
                            </div>
                            {Number((borrowPreview as [bigint, bigint, bigint])[2]) > 7500 && (
                                <div className="p-2 bg-orange-500/10 border border-orange-500/30 rounded text-xs text-orange-400">
                                    ⚠️ Warning: New LTV will be above 75%
                                </div>
                            )}
                        </>
                    ) : mode === 'repay' ? (
                        <>
                            <div className="flex justify-between">
                                <span className="text-white/60">Repay Amount</span>
                                <span className="text-white">
                                    {formatIDR(parsedAmount, 6)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/60">Remaining Debt</span>
                                <span className="text-white">
                                    {formatIDR(currentDebt - parsedAmount, 6)}
                                </span>
                            </div>
                        </>
                    ) : null}
                </div>
            )}

            {/* Action Button */}
            <Button
                className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-semibold mb-2"
                onClick={handleButtonClick}
                disabled={isButtonDisabled()}
            >
                {getButtonContent()}
            </Button>

            {/* Repay Full Button */}
            {mode === 'repay' && currentDebt > 0n && (
                <Button
                    variant="outline"
                    className="w-full border-yellow-500/30 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
                    onClick={handleRepayFull}
                    disabled={repayFull.isPending || repayFull.isConfirming || !idrxBalance || idrxBalance < currentDebt}
                >
                    {repayFull.isPending || repayFull.isConfirming ? 'Repaying...' : 'Repay Full Debt'}
                </Button>
            )}
        </div>
    );
}
