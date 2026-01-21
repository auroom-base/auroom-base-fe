'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTokenBalance } from '@/hooks/contracts/useTokenBalance';
import { useXAUTAllowance, useXAUTApprove } from '@/hooks/contracts/useXAUTApproval';
import { useDepositCollateral, useWithdrawCollateral, usePreviewWithdraw } from '@/hooks/contracts/useBorrowingProtocol';
import { BASE_CONTRACTS as CONTRACTS } from '@/lib/contracts/base_addresses';
import { parseAmount, formatAmount, formatXAUT, formatLTV } from '@/lib/utils/borrow';
import { useToast } from '@/hooks/use-toast';

interface CollateralCardProps {
    currentCollateral: bigint;
    onSuccess?: () => void;
}

export function CollateralCard({ currentCollateral, onSuccess }: CollateralCardProps) {
    const { address } = useAccount();
    const { toast } = useToast();
    const [mode, setMode] = useState<'deposit' | 'withdraw'>('deposit');
    const [amount, setAmount] = useState('');

    // Get XAUT balance
    const { data: xautBalance } = useTokenBalance(CONTRACTS.XAUT, address) as { data: bigint | undefined };

    // Parse amount
    const parsedAmount = amount ? parseAmount(amount, 6) : 0n;

    // Approval hooks
    const { data: allowance } = useXAUTAllowance();
    const approval = useXAUTApprove();

    // Transaction hooks
    const deposit = useDepositCollateral();
    const withdraw = useWithdrawCollateral();

    // Preview withdraw
    const { data: withdrawPreview } = usePreviewWithdraw(parsedAmount);

    const needsApproval = mode === 'deposit' && allowance !== undefined && allowance !== null && parsedAmount > 0n && (allowance as bigint) < parsedAmount;

    // Handle success
    useEffect(() => {
        if (deposit.isSuccess || withdraw.isSuccess) {
            toast({
                title: mode === 'deposit' ? 'Collateral Deposited!' : 'Collateral Withdrawn!',
                description: `Successfully ${mode === 'deposit' ? 'deposited' : 'withdrew'} ${amount} XAUT`,
            });
            setAmount('');
            onSuccess?.();
        }
    }, [deposit.isSuccess, withdraw.isSuccess]);

    // Handle errors
    useEffect(() => {
        if (deposit.error) {
            toast({
                title: 'Deposit Failed',
                description: deposit.error.message,
                variant: 'destructive',
            });
        }
        if (withdraw.error) {
            toast({
                title: 'Withdraw Failed',
                description: withdraw.error.message,
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
    }, [deposit.error, withdraw.error, approval.error]);

    const handleMax = () => {
        if (mode === 'deposit' && xautBalance) {
            setAmount(formatAmount(xautBalance, 6));
        } else if (mode === 'withdraw' && currentCollateral) {
            setAmount(formatAmount(currentCollateral, 6));
        }
    };

    const handleApprove = () => {
        if (parsedAmount > 0n) {
            approval.approve(parsedAmount);
        }
    };

    const handleDeposit = () => {
        if (parsedAmount > 0n) {
            deposit.deposit(parsedAmount);
        }
    };

    const handleWithdraw = () => {
        if (parsedAmount > 0n) {
            withdraw.withdraw(parsedAmount);
        }
    };

    const getButtonContent = () => {
        if (!address) return 'Connect Wallet';
        if (!amount || parsedAmount === 0n) return 'Enter Amount';

        if (mode === 'deposit') {
            if (xautBalance && parsedAmount > xautBalance) return 'Insufficient XAUT Balance';
            if (needsApproval) {
                if (approval.isPending || approval.isConfirming) return 'Approving...';
                return 'Approve XAUT';
            }
            if (deposit.isPending || deposit.isConfirming) return 'Depositing...';
            return 'Deposit Collateral';
        } else {
            if (currentCollateral && parsedAmount > currentCollateral) return 'Insufficient Collateral';
            if (withdrawPreview && !(withdrawPreview as [boolean, bigint])[0]) return 'Would Exceed Max LTV';
            if (withdraw.isPending || withdraw.isConfirming) return 'Withdrawing...';
            return 'Withdraw Collateral';
        }
    };

    const isButtonDisabled = () => {
        if (!address || !amount || parsedAmount === 0n) return true;
        if (mode === 'deposit' && xautBalance && parsedAmount > xautBalance) return true;
        if (mode === 'withdraw' && currentCollateral && parsedAmount > currentCollateral) return true;
        if (mode === 'withdraw' && withdrawPreview && !(withdrawPreview as [boolean, bigint])[0]) return true;
        if (approval.isPending || approval.isConfirming) return true;
        if (deposit.isPending || deposit.isConfirming) return true;
        if (withdraw.isPending || withdraw.isConfirming) return true;
        return false;
    };

    const handleButtonClick = () => {
        if (mode === 'deposit') {
            if (needsApproval) {
                handleApprove();
            } else {
                handleDeposit();
            }
        } else {
            handleWithdraw();
        }
    };

    return (
        <div className="p-6 rounded-2xl bg-zinc-900 border-2 border-yellow-500/30 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Manage Collateral</h3>

            {/* Mode Toggle */}
            <div className="flex gap-2 mb-4">
                <Button
                    variant={mode === 'deposit' ? 'default' : 'outline'}
                    onClick={() => setMode('deposit')}
                    className={mode === 'deposit'
                        ? 'flex-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-black'
                        : 'flex-1 border-yellow-500/30 bg-yellow-500/10 text-yellow-400'}
                >
                    Deposit
                </Button>
                <Button
                    variant={mode === 'withdraw' ? 'default' : 'outline'}
                    onClick={() => setMode('withdraw')}
                    className={mode === 'withdraw'
                        ? 'flex-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-black'
                        : 'flex-1 border-yellow-500/30 bg-yellow-500/10 text-yellow-400'}
                >
                    Withdraw
                </Button>
            </div>

            {/* Balance Display */}
            <div className="mb-4 p-3 bg-black/50 border border-white/10 rounded-lg">
                <div className="flex justify-between text-sm">
                    <span className="text-white/60">
                        {mode === 'deposit' ? 'Your XAUT Balance' : 'Your Collateral'}
                    </span>
                    <span className="text-white font-medium">
                        {mode === 'deposit'
                            ? (xautBalance ? formatXAUT(xautBalance) : '0.00')
                            : formatXAUT(currentCollateral)
                        } XAUT
                    </span>
                </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-2 mb-4">
                <label className="text-sm text-white/60">Amount</label>
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
                    {mode === 'deposit' ? (
                        <div className="flex justify-between">
                            <span className="text-white/60">New Collateral</span>
                            <span className="text-white">
                                {formatXAUT(currentCollateral + parsedAmount)} XAUT
                            </span>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between">
                                <span className="text-white/60">New Collateral</span>
                                <span className="text-white">
                                    {formatXAUT(currentCollateral - parsedAmount)} XAUT
                                </span>
                            </div>
                            {withdrawPreview && (
                                <div className="flex justify-between">
                                    <span className="text-white/60">New LTV</span>
                                    <span className="text-white">
                                        {formatLTV((withdrawPreview as [boolean, bigint])[1])}
                                    </span>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Action Button */}
            <Button
                className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-semibold"
                onClick={handleButtonClick}
                disabled={isButtonDisabled()}
            >
                {getButtonContent()}
            </Button>
        </div>
    );
}
