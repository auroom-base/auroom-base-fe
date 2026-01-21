'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PreviewCard } from './PreviewCard';
import { SuccessModal } from './SuccessModal';
import { useAccount } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { useTokenBalance } from '@/hooks/contracts/useTokenBalance';
import { useIDRXAllowanceV2, useIDRXApproveV2 } from '@/hooks/contracts/useTokenApprovalsV2';
import { useRepayAndWithdraw, useClosePosition, usePreviewRepayAndWithdraw } from '@/hooks/contracts/useBorrowingProtocolV2';
import { BASE_CONTRACTS as CONTRACTS } from '@/lib/contracts/base_addresses';
import { Loader2, Wallet, DoorClosed, CheckCircle2 } from 'lucide-react';

interface RepayFormProps {
    currentDebt: bigint;
    currentCollateral: bigint;
    onSuccess: () => void;
}

export function RepayForm({ currentDebt, currentCollateral, onSuccess }: RepayFormProps) {
    const { address } = useAccount();
    const [repayInput, setRepayInput] = useState('');
    const [withdrawInput, setWithdrawInput] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [successType, setSuccessType] = useState<'repay' | 'close'>('repay');

    // Debounced values for preview
    const [debouncedRepay, setDebouncedRepay] = useState('');
    const [debouncedWithdraw, setDebouncedWithdraw] = useState('');

    // Get IDRX balance
    const { data: idrxBalance } = useTokenBalance(CONTRACTS.IDRX, address);

    // Get allowance and approval
    const { data: allowance, refetch: refetchAllowance } = useIDRXAllowanceV2();
    const approveIDRX = useIDRXApproveV2();

    // Parse inputs to bigint
    const repayAmount = repayInput ? parseUnits(repayInput, 6) : BigInt(0);
    const withdrawAmount = withdrawInput ? parseUnits(withdrawInput, 6) : BigInt(0);

    const debouncedRepayAmount = debouncedRepay ? parseUnits(debouncedRepay, 6) : BigInt(0);
    const debouncedWithdrawAmount = debouncedWithdraw ? parseUnits(debouncedWithdraw, 6) : BigInt(0);

    // Get preview - only call when debounced values change
    const { data: preview } = usePreviewRepayAndWithdraw(debouncedRepayAmount, debouncedWithdrawAmount);

    // Hooks
    const repayAndWithdraw = useRepayAndWithdraw();
    const closePosition = useClosePosition();

    // Debounce effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedRepay(repayInput);
            setDebouncedWithdraw(withdrawInput);
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [repayInput, withdrawInput]);

    // Check if approval is needed
    const needsApproval = allowance !== undefined && repayAmount > (allowance as bigint);

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
        return Number(formatUnits(value, 6)).toFixed(6);
    };

    // Handle percentage buttons for repay
    const handleRepayPercentage = (percent: number) => {
        const maxAmount = idrxBalance && (idrxBalance as bigint) < currentDebt
            ? (idrxBalance as bigint)
            : currentDebt;
        const amount = (maxAmount * BigInt(percent)) / BigInt(100);
        setRepayInput(formatUnits(amount, 6));
    };

    // Handle full repayment
    const handleRepayFull = () => {
        setRepayInput(formatUnits(currentDebt, 6));
    };

    // Handle max safe withdraw
    const handleMaxSafeWithdraw = () => {
        // This is a simplified calculation
        // In reality, you'd want to calculate based on maintaining safe LTV
        const safeAmount = currentCollateral / BigInt(2); // Conservative: 50% of collateral
        setWithdrawInput(formatUnits(safeAmount, 6));
    };

    // Handle approve
    const handleApprove = () => {
        // Approve max for convenience
        approveIDRX.approve(BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'));
    };

    // Handle repay and withdraw
    const handleRepayAndWithdraw = () => {
        repayAndWithdraw.execute(repayAmount, withdrawAmount);
    };

    // Handle close position
    const handleClosePosition = () => {
        setSuccessType('close');
        closePosition.execute();
    };

    // Refetch allowance after approval success
    useEffect(() => {
        if (approveIDRX.isSuccess) {
            refetchAllowance();
        }
    }, [approveIDRX.isSuccess, refetchAllowance]);

    // Show success modal after repay
    useEffect(() => {
        if (repayAndWithdraw.isSuccess) {
            setShowSuccess(true);
            onSuccess();
            setRepayInput('');
            setWithdrawInput('');
            repayAndWithdraw.reset();
        }
    }, [repayAndWithdraw.isSuccess, onSuccess, repayAndWithdraw]);

    // Show success modal after close
    useEffect(() => {
        if (closePosition.isSuccess) {
            setShowSuccess(true);
            onSuccess();
            closePosition.reset();
        }
    }, [closePosition.isSuccess, onSuccess, closePosition]);

    const isFormValid = repayAmount > BigInt(0) || withdrawAmount > BigInt(0);

    // Smart contract returns array: [success, newLTV]
    const previewArray = preview as readonly [boolean, bigint] | undefined;
    const previewData = previewArray ? {
        success: previewArray[0],
        newLTV: previewArray[1],
    } : undefined;

    // Button enabled when form valid and preview shows success
    const canRepay = isFormValid && previewData?.success;

    // Show message if no position
    if (currentDebt === BigInt(0) && currentCollateral === BigInt(0)) {
        return (
            <div className="p-8 rounded-2xl bg-zinc-900 border-2 border-yellow-500/30 text-center">
                <p className="text-white/60 text-lg">
                    You don't have an active position yet.
                </p>
                <p className="text-white/40 text-sm mt-2">
                    Go to the Borrow tab to create a position.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Current Position Info */}
            <div className="p-6 rounded-2xl bg-zinc-900 border-2 border-yellow-500/30">
                <h3 className="text-lg font-semibold text-white mb-4">Current Position</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-white/60 mb-1">Debt</p>
                        <p className="text-xl font-bold text-white">{formatIDR(currentDebt)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-white/60 mb-1">Collateral</p>
                        <p className="text-xl font-bold text-white">{formatXAUT(currentCollateral)} XAUT</p>
                    </div>
                </div>
            </div>

            {/* Input Section */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Repay Input */}
                <div className="p-6 rounded-2xl bg-zinc-900 border-2 border-yellow-500/30">
                    <h3 className="text-lg font-semibold text-white mb-4">Repay Amount</h3>

                    <div className="space-y-3">
                        <Input
                            type="number"
                            placeholder="0.00"
                            value={repayInput}
                            onChange={(e) => setRepayInput(e.target.value)}
                            className="bg-black/40 border-yellow-500/30 text-white text-lg h-12"
                        />

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-white/60">Balance:</span>
                            <span className="text-white font-semibold">
                                {idrxBalance ? formatIDR(idrxBalance as bigint) : formatIDR(BigInt(0))}
                            </span>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRepayPercentage(25)}
                                className="flex-1 border-yellow-500/30 hover:bg-yellow-500/10"
                            >
                                25%
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRepayPercentage(50)}
                                className="flex-1 border-yellow-500/30 hover:bg-yellow-500/10"
                            >
                                50%
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleRepayFull}
                                className="flex-1 border-yellow-500/30 hover:bg-yellow-500/10"
                            >
                                FULL
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Withdraw Input */}
                <div className="p-6 rounded-2xl bg-zinc-900 border-2 border-yellow-500/30">
                    <h3 className="text-lg font-semibold text-white mb-4">Withdraw Collateral</h3>

                    <div className="space-y-3">
                        <Input
                            type="number"
                            placeholder="0.00"
                            value={withdrawInput}
                            onChange={(e) => setWithdrawInput(e.target.value)}
                            className="bg-black/40 border-yellow-500/30 text-white text-lg h-12"
                        />

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-white/60">Available:</span>
                            <span className="text-white font-semibold">
                                {formatXAUT(currentCollateral)} XAUT
                            </span>
                        </div>

                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleMaxSafeWithdraw}
                            className="w-full border-yellow-500/30 hover:bg-yellow-500/10"
                        >
                            MAX SAFE
                        </Button>
                    </div>
                </div>
            </div>

            {/* Preview */}
            {isFormValid && previewData && (
                <PreviewCard
                    title="PREVIEW"
                    items={[
                        {
                            label: 'Repay Amount:',
                            value: formatIDR(repayAmount),
                        },
                        {
                            label: 'Withdraw Amount:',
                            value: `${formatXAUT(withdrawAmount)} XAUT`,
                        },
                        {
                            label: 'New Debt:',
                            value: formatIDR(currentDebt - repayAmount),
                        },
                        {
                            label: 'New Collateral:',
                            value: `${formatXAUT(currentCollateral - withdrawAmount)} XAUT`,
                        },
                        {
                            label: 'New LTV:',
                            value: `${(Number(previewData.newLTV) / 100).toFixed(2)}%`,
                            warning: !previewData.success,
                            highlight: previewData.success,
                        },
                    ]}
                />
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
                {needsApproval ? (
                    <Button
                        onClick={handleApprove}
                        disabled={approveIDRX.isPending || approveIDRX.isConfirming}
                        className="w-full h-14 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold text-lg"
                    >
                        {approveIDRX.isPending || approveIDRX.isConfirming ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                {approveIDRX.isPending ? 'Approving...' : 'Confirming...'}
                            </>
                        ) : approveIDRX.isSuccess ? (
                            <>
                                <CheckCircle2 className="w-5 h-5 mr-2" />
                                Approved! Click Repay
                            </>
                        ) : (
                            'Approve IDRX'
                        )}
                    </Button>
                ) : (
                    <Button
                        onClick={handleRepayAndWithdraw}
                        disabled={!canRepay || repayAndWithdraw.isPending || repayAndWithdraw.isConfirming}
                        className="w-full h-14 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold text-lg"
                    >
                        {repayAndWithdraw.isPending || repayAndWithdraw.isConfirming ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                {repayAndWithdraw.isPending ? 'Processing...' : 'Confirming...'}
                            </>
                        ) : (
                            <>
                                <Wallet className="w-5 h-5 mr-2" />
                                REPAY & WITHDRAW
                            </>
                        )}
                    </Button>
                )}

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-yellow-500/20" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-black px-2 text-white/40">OR</span>
                    </div>
                </div>

                {/* Close Position Button */}
                <Button
                    onClick={handleClosePosition}
                    disabled={closePosition.isPending || closePosition.isConfirming}
                    variant="outline"
                    className="w-full h-14 border-2 border-red-500/50 text-red-400 hover:bg-red-500/10 font-bold text-lg"
                >
                    {closePosition.isPending || closePosition.isConfirming ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            {closePosition.isPending ? 'Closing...' : 'Confirming...'}
                        </>
                    ) : (
                        <>
                            <DoorClosed className="w-5 h-5 mr-2" />
                            CLOSE ENTIRE POSITION
                        </>
                    )}
                </Button>
                <p className="text-center text-xs text-white/40">
                    Repay all debt and withdraw all collateral
                </p>
            </div>

            {/* Success Modal */}
            <SuccessModal
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                type={successType}
                data={{
                    amount: successType === 'repay' ? formatIDR(repayAmount) : formatIDR(currentDebt),
                    txHash: successType === 'repay' ? repayAndWithdraw.hash : closePosition.hash,
                }}
            />
        </div>
    );
}
