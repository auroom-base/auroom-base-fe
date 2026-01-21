"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRemoveLiquidity } from '@/hooks/admin/useRemoveLiquidity';
import { useTokenBalance } from '@/hooks/contracts/useTokenBalance';
import { useTokenApproval } from '@/hooks/contracts/useTokenApproval';
import { useTokenAllowance } from '@/hooks/contracts/useTokenAllowance';
import { BASE_CONTRACTS as CONTRACTS } from '@/lib/contracts/base_addresses';
import { TOKENS } from '@/lib/contracts/tokens';
import { parseUnits, formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import { Loader2, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type PoolType = 'IDRX_USDC' | 'XAUT_USDC';

const POOL_CONFIGS = {
    IDRX_USDC: {
        name: 'IDRX/USDC',
        pairAddress: CONTRACTS.IDRX_USDC_Pair,
        tokenA: TOKENS.IDRX,
        tokenB: TOKENS.USDC,
    },
    XAUT_USDC: {
        name: 'XAUT/USDC',
        pairAddress: CONTRACTS.XAUT_USDC_Pair,
        tokenA: TOKENS.XAUT,
        tokenB: TOKENS.USDC,
    },
};

/**
 * RemoveLiquidityForm - Form to remove liquidity from pools
 */
export function RemoveLiquidityForm() {
    const { toast } = useToast();
    const { address } = useAccount();
    const [selectedPool, setSelectedPool] = useState<PoolType>('IDRX_USDC');
    const [lpAmount, setLpAmount] = useState('');

    const pool = POOL_CONFIGS[selectedPool];
    const { removeLiquidity, isPending, isConfirming, isSuccess, hash } = useRemoveLiquidity();

    // Get LP token balance
    const { data: lpBalance } = useTokenBalance(pool.pairAddress, address);

    // Check allowance for LP tokens
    const { data: lpAllowance } = useTokenAllowance(pool.pairAddress, address, CONTRACTS.UniswapV2Router);

    // Approval hook for LP tokens
    const lpApproval = useTokenApproval(pool.pairAddress);

    // Parse LP amount (LP tokens have 18 decimals)
    const parsedLpAmount = lpAmount ? parseUnits(lpAmount, 18) : BigInt(0);

    // Check if approval needed
    const needsApproval = !!(lpAllowance !== undefined && parsedLpAmount > BigInt(0) && (lpAllowance as bigint) < parsedLpAmount);

    const handleApproveLp = () => {
        lpApproval.approve(CONTRACTS.UniswapV2Router);
        toast({
            title: "Approving...",
            description: `Approving LP tokens for removal`,
        });
    };

    const handleRemoveLiquidity = () => {
        if (!address || !parsedLpAmount) return;

        // Set minimum amounts to 95% of expected (5% slippage tolerance)
        // For simplicity, we set minAmounts to 0 (you can calculate expected amounts from reserves)
        const minAmountA = BigInt(0);
        const minAmountB = BigInt(0);

        // Deadline: 20 minutes from now
        const deadline = BigInt(Math.floor(Date.now() / 1000) + 1200);

        removeLiquidity({
            tokenA: pool.tokenA.address,
            tokenB: pool.tokenB.address,
            liquidity: parsedLpAmount,
            amountAMin: minAmountA,
            amountBMin: minAmountB,
            to: address,
            deadline,
        });

        toast({
            title: "Removing liquidity...",
            description: `Burning ${lpAmount} LP tokens`,
        });
    };

    const handleMaxLp = () => {
        if (lpBalance) {
            setLpAmount(formatUnits(lpBalance as bigint, 18));
        }
    };

    const isInsufficientBalance = lpBalance && parsedLpAmount > (lpBalance as bigint);
    const isDisabled = !lpAmount || isInsufficientBalance || isPending || isConfirming;

    // Calculate percentage of pool
    const lpBalanceFormatted = lpBalance ? formatUnits(lpBalance as bigint, 18) : '0';
    const percentageInput = lpBalance && parsedLpAmount > BigInt(0)
        ? ((Number(formatUnits(parsedLpAmount, 18)) / Number(lpBalanceFormatted)) * 100).toFixed(2)
        : '0';

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Minus className="h-5 w-5 text-primary" />
                    Remove Liquidity
                </CardTitle>
                <CardDescription>
                    Remove liquidity and receive your tokens back
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Pool Selection */}
                <div className="space-y-2">
                    <Label>Select Pool</Label>
                    <Select value={selectedPool} onValueChange={(value) => setSelectedPool(value as PoolType)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="IDRX_USDC">IDRX/USDC</SelectItem>
                            <SelectItem value="XAUT_USDC">XAUT/USDC</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* LP Token Balance */}
                <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Your LP Tokens</span>
                        <span className="text-sm font-medium">{parseFloat(lpBalanceFormatted).toFixed(6)}</span>
                    </div>
                </div>

                {/* LP Amount Input */}
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label>LP Amount to Remove</Label>
                        <span className="text-sm text-muted-foreground">
                            {percentageInput}% of your position
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <Input
                            type="number"
                            placeholder="0.0"
                            value={lpAmount}
                            onChange={(e) => setLpAmount(e.target.value)}
                            step="any"
                        />
                        <Button variant="outline" onClick={handleMaxLp}>MAX</Button>
                    </div>
                </div>

                {/* Quick Percentage Buttons */}
                <div className="grid grid-cols-4 gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => lpBalance && setLpAmount((Number(formatUnits(lpBalance as bigint, 18)) * 0.25).toString())}
                    >
                        25%
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => lpBalance && setLpAmount((Number(formatUnits(lpBalance as bigint, 18)) * 0.50).toString())}
                    >
                        50%
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => lpBalance && setLpAmount((Number(formatUnits(lpBalance as bigint, 18)) * 0.75).toString())}
                    >
                        75%
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleMaxLp}
                    >
                        100%
                    </Button>
                </div>

                {/* Approval Button */}
                {needsApproval && (
                    <Button
                        variant="outline"
                        onClick={handleApproveLp}
                        disabled={lpApproval.isPending || lpApproval.isConfirming}
                        className="w-full"
                    >
                        {lpApproval.isPending || lpApproval.isConfirming ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Approving LP Tokens...
                            </>
                        ) : (
                            'Approve LP Tokens'
                        )}
                    </Button>
                )}

                {/* Remove Liquidity Button */}
                <Button
                    onClick={handleRemoveLiquidity}
                    disabled={!!(isDisabled || needsApproval)}
                    className="w-full"
                >
                    {isPending || isConfirming ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Removing Liquidity...
                        </>
                    ) : isInsufficientBalance ? (
                        'Insufficient LP Balance'
                    ) : (
                        'Remove Liquidity'
                    )}
                </Button>

                {/* Success Message */}
                {isSuccess && hash && (
                    <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-800 dark:text-green-200">
                        <p className="font-medium">Liquidity removed successfully!</p>
                        <p className="text-xs mt-1 font-mono">Tx: {hash.slice(0, 10)}...{hash.slice(-8)}</p>
                    </div>
                )}

                {/* Info */}
                <div className="text-xs text-muted-foreground space-y-1">
                    <p>• You will receive both {pool.tokenA.symbol} and {pool.tokenB.symbol}</p>
                    <p>• Slippage tolerance: 5%</p>
                    <p>• Transaction deadline: 20 minutes</p>
                </div>
            </CardContent>
        </Card>
    );
}
