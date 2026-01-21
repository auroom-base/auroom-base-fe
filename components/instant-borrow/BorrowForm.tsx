'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PreviewCard } from './PreviewCard';
import { SuccessModal } from './SuccessModal';
import { useAccount } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { useTokenBalance } from '@/hooks/contracts/useTokenBalance';
import { useXAUTAllowanceV2, useXAUTApproveV2 } from '@/hooks/contracts/useTokenApprovalsV2';
import { useDepositAndBorrow, usePreviewDepositAndBorrow, useXAUTPriceV2 } from '@/hooks/contracts/useBorrowingProtocolV2';
import { BASE_CONTRACTS as CONTRACTS } from '@/lib/contracts/base_addresses';
import { Loader2, Zap, CheckCircle2 } from 'lucide-react';

interface BorrowFormProps {
    maxBorrow: bigint;
    onSuccess: () => void;
}

export function BorrowForm({ maxBorrow, onSuccess }: BorrowFormProps) {
    const { address } = useAccount();
    const [collateralInput, setCollateralInput] = useState('');
    const [borrowInput, setBorrowInput] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    // Debounced values for preview
    const [debouncedCollateral, setDebouncedCollateral] = useState('');
    const [debouncedBorrow, setDebouncedBorrow] = useState('');

    // Get XAUT balance
    const { data: xautBalance } = useTokenBalance(CONTRACTS.XAUT, address);

    // Get XAUT price
    const { data: xautPrice } = useXAUTPriceV2();

    // Get allowance and approval
    const { data: allowance, refetch: refetchAllowance } = useXAUTAllowanceV2();
    const approveXAUT = useXAUTApproveV2();

    // Parse inputs to bigint
    const collateralAmount = collateralInput ? parseUnits(collateralInput, 6) : BigInt(0);
    const borrowAmount = borrowInput ? parseUnits(borrowInput, 6) : BigInt(0);

    // Debounced amounts for preview
    const debouncedCollateralAmount = debouncedCollateral ? parseUnits(debouncedCollateral, 6) : BigInt(0);
    const debouncedBorrowAmount = debouncedBorrow ? parseUnits(debouncedBorrow, 6) : BigInt(0);

    // Get preview - only call when debounced values change
    const { data: preview } = usePreviewDepositAndBorrow(debouncedCollateralAmount, debouncedBorrowAmount);

    // Borrow hook
    const depositAndBorrow = useDepositAndBorrow();

    // Check if approval is needed
    const needsApproval = allowance !== undefined && collateralAmount > (allowance as bigint);

    // Calculate max borrow for current collateral
    const calculateMaxBorrowForCollateral = () => {
        if (!collateralAmount || !xautPrice) return BigInt(0);
        const collateralValue = (collateralAmount * (xautPrice as bigint)) / BigInt(1e8);
        return (collateralValue * BigInt(7500)) / BigInt(10000);
    };

    const maxBorrowForCollateral = calculateMaxBorrowForCollateral();

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

    // Handle percentage buttons for collateral
    const handleCollateralPercentage = (percent: number) => {
        if (!xautBalance) return;
        const amount = ((xautBalance as bigint) * BigInt(percent)) / BigInt(100);
        setCollateralInput(formatUnits(amount, 6));
    };

    // Handle percentage buttons for borrow
    const handleBorrowPercentage = (percent: number) => {
        const maxAmount = maxBorrowForCollateral || maxBorrow;
        const amount = (maxAmount * BigInt(percent)) / BigInt(100);
        setBorrowInput(formatUnits(amount, 6));
    };

    // Handle approve
    const handleApprove = () => {
        // Approve max for convenience
        approveXAUT.approve(BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'));
    };

    // Handle borrow
    const handleBorrow = () => {
        depositAndBorrow.execute(collateralAmount, borrowAmount);
    };

    // Debounce effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedCollateral(collateralInput);
            setDebouncedBorrow(borrowInput);
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [collateralInput, borrowInput]);

    // Refetch allowance after approval success
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
            // Reset form
            setCollateralInput('');
            setBorrowInput('');
            depositAndBorrow.reset();
        }
    }, [depositAndBorrow.isSuccess, onSuccess, depositAndBorrow]);

    const isFormValid = collateralAmount > BigInt(0) && borrowAmount > BigInt(0);

    // Smart contract returns array: [amountReceived, fee, newLTV, allowed]
    const previewArray = preview as readonly [bigint, bigint, bigint, boolean] | undefined;
    const previewData = previewArray ? {
        amountReceived: previewArray[0],
        fee: previewArray[1],
        newLTV: previewArray[2],
        allowed: previewArray[3],
    } : undefined;

    // Button enabled when form valid and preview allows transaction
    const canBorrow = isFormValid && previewData?.allowed;

    // DEBUG: Log state
    useEffect(() => {
        console.log('🔍 BorrowForm Debug:', {
            collateralInput,
            borrowInput,
            collateralAmount: collateralAmount.toString(),
            borrowAmount: borrowAmount.toString(),
            debouncedCollateralAmount: debouncedCollateralAmount.toString(),
            debouncedBorrowAmount: debouncedBorrowAmount.toString(),
            isFormValid,
            previewArray,
            previewData,
            canBorrow,
            needsApproval,
        });
    }, [collateralInput, borrowInput, collateralAmount, borrowAmount, debouncedCollateralAmount, debouncedBorrowAmount, isFormValid, previewArray, previewData, canBorrow, needsApproval]);

    return (
        <div className="space-y-6">
            {/* Input Section */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Collateral Input */}
                <div className="p-6 rounded-2xl bg-zinc-900 border-2 border-yellow-500/30">
                    <h3 className="text-lg font-semibold text-white mb-4">Jaminan XAUT</h3>

                    <div className="space-y-3">
                        <Input
                            type="number"
                            placeholder="0.00"
                            value={collateralInput}
                            onChange={(e) => setCollateralInput(e.target.value)}
                            className="bg-black/40 border-yellow-500/30 text-white text-lg h-12"
                        />

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-white/60">Balance:</span>
                            <span className="text-white font-semibold">
                                {xautBalance ? formatXAUT(xautBalance as bigint) : '0.00'} XAUT
                            </span>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCollateralPercentage(25)}
                                className="flex-1 border-yellow-500/30 hover:bg-yellow-500/10"
                            >
                                25%
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCollateralPercentage(50)}
                                className="flex-1 border-yellow-500/30 hover:bg-yellow-500/10"
                            >
                                50%
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCollateralPercentage(100)}
                                className="flex-1 border-yellow-500/30 hover:bg-yellow-500/10"
                            >
                                MAX
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Borrow Input */}
                <div className="p-6 rounded-2xl bg-zinc-900 border-2 border-yellow-500/30">
                    <h3 className="text-lg font-semibold text-white mb-4">Pinjam IDRX</h3>

                    <div className="space-y-3">
                        <Input
                            type="number"
                            placeholder="0.00"
                            value={borrowInput}
                            onChange={(e) => setBorrowInput(e.target.value)}
                            className="bg-black/40 border-yellow-500/30 text-white text-lg h-12"
                        />

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-white/60">Max Borrow:</span>
                            <span className="text-white font-semibold">
                                {formatIDR(maxBorrowForCollateral || maxBorrow)}
                            </span>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleBorrowPercentage(25)}
                                className="flex-1 border-yellow-500/30 hover:bg-yellow-500/10"
                            >
                                25%
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleBorrowPercentage(50)}
                                className="flex-1 border-yellow-500/30 hover:bg-yellow-500/10"
                            >
                                50%
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleBorrowPercentage(100)}
                                className="flex-1 border-yellow-500/30 hover:bg-yellow-500/10"
                            >
                                MAX
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview */}
            {isFormValid && previewData && (
                <PreviewCard
                    title="PREVIEW"
                    items={[
                        {
                            label: 'Collateral Value:',
                            value: formatIDR((collateralAmount * (xautPrice as bigint || BigInt(0))) / BigInt(1e8)),
                        },
                        {
                            label: 'Borrow Amount:',
                            value: formatIDR(borrowAmount),
                        },
                        {
                            label: 'Fee (0.5%):',
                            value: formatIDR(previewData.fee),
                        },
                        {
                            label: 'You Receive:',
                            value: formatIDR(previewData.amountReceived),
                            highlight: true,
                        },
                        {
                            label: 'New LTV:',
                            value: `${(Number(previewData.newLTV) / 100).toFixed(2)}%`,
                            warning: !previewData.allowed,
                            highlight: previewData.allowed,
                        },
                    ]}
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
                                BORROW INSTANTLY
                            </>
                        )}
                    </Button>
                )}

                <p className="text-center text-sm text-white/60">
                    ⓘ Setelah borrow, lanjut ke tab Redeem untuk cairkan ke bank
                </p>
            </div>

            {/* Success Modal */}
            <SuccessModal
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                type="borrow"
                data={{
                    amount: previewData ? formatIDR(previewData.amountReceived) : '',
                    fee: previewData ? formatIDR(previewData.fee) : '',
                    txHash: depositAndBorrow.hash,
                }}
                onContinue={() => {
                    setShowSuccess(false);
                    // Parent component should handle tab change
                }}
            />
        </div>
    );
}
