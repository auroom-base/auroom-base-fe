"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddLiquidity } from '@/hooks/admin/useAddLiquidity';
import { useTokenBalance } from '@/hooks/contracts/useTokenBalance';
import { useTokenApproval } from '@/hooks/contracts/useTokenApproval';
import { useTokenAllowance } from '@/hooks/contracts/useTokenAllowance';
import { MANTLE_CONTRACTS as CONTRACTS } from '@/lib/contracts/mantle_addresses';
import { TOKENS } from '@/lib/contracts/tokens';
import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import { Loader2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type PoolType = 'IDRX_USDC' | 'XAUT_USDC';

const POOL_CONFIGS = {
    IDRX_USDC: {
        name: 'IDRX/USDC',
        tokenA: TOKENS.IDRX,
        tokenB: TOKENS.USDC,
    },
    XAUT_USDC: {
        name: 'XAUT/USDC',
        tokenA: TOKENS.XAUT,
        tokenB: TOKENS.USDC,
    },
};

/**
 * AddLiquidityForm - Form to add liquidity to pools
 */
export function AddLiquidityForm() {
    const { toast } = useToast();
    const { address } = useAccount();
    const [selectedPool, setSelectedPool] = useState<PoolType>('IDRX_USDC');
    const [amountA, setAmountA] = useState('');
    const [amountB, setAmountB] = useState('');

    const pool = POOL_CONFIGS[selectedPool];
    const { addLiquidity, isPending, isConfirming, isSuccess, hash } = useAddLiquidity();

    // Get balances
    const { data: balanceA } = useTokenBalance(pool.tokenA.address, address);
    const { data: balanceB } = useTokenBalance(pool.tokenB.address, address);

    // Check allowances
    const { data: allowanceA } = useTokenAllowance(pool.tokenA.address, address, CONTRACTS.UniswapV2Router);
    const { data: allowanceB } = useTokenAllowance(pool.tokenB.address, address, CONTRACTS.UniswapV2Router);

    // Approval hooks
    const approvalA = useTokenApproval(pool.tokenA.address);
    const approvalB = useTokenApproval(pool.tokenB.address);

    // Parse amounts
    const parsedAmountA = amountA ? parseUnits(amountA, pool.tokenA.decimals) : BigInt(0);
    const parsedAmountB = amountB ? parseUnits(amountB, pool.tokenB.decimals) : BigInt(0);

    // Check if approvals needed
    const needsApprovalA = allowanceA !== undefined && parsedAmountA > BigInt(0) && (allowanceA as bigint) < parsedAmountA;
    const needsApprovalB = allowanceB !== undefined && parsedAmountB > BigInt(0) && (allowanceB as bigint) < parsedAmountB;

    const handleApproveA = () => {
        approvalA.approve(CONTRACTS.UniswapV2Router);
        toast({
            title: "Approving...",
            description: `Approving ${pool.tokenA.symbol} for liquidity`,
        });
    };

    const handleApproveB = () => {
        approvalB.approve(CONTRACTS.UniswapV2Router);
        toast({
            title: "Approving...",
            description: `Approving ${pool.tokenB.symbol} for liquidity`,
        });
    };

    const handleAddLiquidity = () => {
        if (!address || !parsedAmountA || !parsedAmountB) return;

        // Set minimum amounts to 95% of desired (5% slippage tolerance)
        const minAmountA = (parsedAmountA * BigInt(95)) / BigInt(100);
        const minAmountB = (parsedAmountB * BigInt(95)) / BigInt(100);

        // Deadline: 20 minutes from now
        const deadline = BigInt(Math.floor(Date.now() / 1000) + 1200);

        addLiquidity({
            tokenA: pool.tokenA.address,
            tokenB: pool.tokenB.address,
            amountADesired: parsedAmountA,
            amountBDesired: parsedAmountB,
            amountAMin: minAmountA,
            amountBMin: minAmountB,
            to: address,
            deadline,
        });

        toast({
            title: "Adding liquidity...",
            description: `Adding ${amountA} ${pool.tokenA.symbol} + ${amountB} ${pool.tokenB.symbol}`,
        });
    };

    const handleMaxA = () => {
        if (balanceA) {
            setAmountA((Number(balanceA) / Math.pow(10, pool.tokenA.decimals)).toString());
        }
    };

    const handleMaxB = () => {
        if (balanceB) {
            setAmountB((Number(balanceB) / Math.pow(10, pool.tokenB.decimals)).toString());
        }
    };

    const isInsufficientBalanceA = !!(balanceA && parsedAmountA > (balanceA as bigint));
    const isInsufficientBalanceB = !!(balanceB && parsedAmountB > (balanceB as bigint));
    const isDisabled = !amountA || !amountB || isInsufficientBalanceA || isInsufficientBalanceB || !!isPending || !!isConfirming;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-primary" />
                    Add Liquidity
                </CardTitle>
                <CardDescription>
                    Add liquidity to earn trading fees
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

                {/* Token A Input */}
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label>{pool.tokenA.symbol} Amount</Label>
                        <span className="text-sm text-muted-foreground">
                            Balance: {balanceA ? (Number(balanceA) / Math.pow(10, pool.tokenA.decimals)).toFixed(4) : '0.0000'}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <Input
                            type="number"
                            placeholder="0.0"
                            value={amountA}
                            onChange={(e) => setAmountA(e.target.value)}
                            step="any"
                        />
                        <Button variant="outline" onClick={handleMaxA}>MAX</Button>
                    </div>
                </div>

                {/* Token B Input */}
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label>{pool.tokenB.symbol} Amount</Label>
                        <span className="text-sm text-muted-foreground">
                            Balance: {balanceB ? (Number(balanceB) / Math.pow(10, pool.tokenB.decimals)).toFixed(4) : '0.0000'}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <Input
                            type="number"
                            placeholder="0.0"
                            value={amountB}
                            onChange={(e) => setAmountB(e.target.value)}
                            step="any"
                        />
                        <Button variant="outline" onClick={handleMaxB}>MAX</Button>
                    </div>
                </div>

                {/* Approval Buttons */}
                {needsApprovalA && (
                    <Button
                        variant="outline"
                        onClick={handleApproveA}
                        disabled={approvalA.isPending || approvalA.isConfirming}
                        className="w-full"
                    >
                        {approvalA.isPending || approvalA.isConfirming ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Approving {pool.tokenA.symbol}...
                            </>
                        ) : (
                            `Approve ${pool.tokenA.symbol}`
                        )}
                    </Button>
                )}

                {needsApprovalB && (
                    <Button
                        variant="outline"
                        onClick={handleApproveB}
                        disabled={approvalB.isPending || approvalB.isConfirming}
                        className="w-full"
                    >
                        {approvalB.isPending || approvalB.isConfirming ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Approving {pool.tokenB.symbol}...
                            </>
                        ) : (
                            `Approve ${pool.tokenB.symbol}`
                        )}
                    </Button>
                )}

                {/* Add Liquidity Button */}
                <Button
                    onClick={handleAddLiquidity}
                    disabled={isDisabled || needsApprovalA || needsApprovalB}
                    className="w-full"
                >
                    {isPending || isConfirming ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding Liquidity...
                        </>
                    ) : isInsufficientBalanceA ? (
                        `Insufficient ${pool.tokenA.symbol}`
                    ) : isInsufficientBalanceB ? (
                        `Insufficient ${pool.tokenB.symbol}`
                    ) : (
                        'Add Liquidity'
                    )}
                </Button>

                {/* Success Message */}
                {isSuccess && hash && (
                    <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-800 dark:text-green-200">
                        <p className="font-medium">Liquidity added successfully!</p>
                        <p className="text-xs mt-1 font-mono">Tx: {hash.slice(0, 10)}...{hash.slice(-8)}</p>
                    </div>
                )}

                {/* Info */}
                <div className="text-xs text-muted-foreground space-y-1">
                    <p>• Slippage tolerance: 5%</p>
                    <p>• Transaction deadline: 20 minutes</p>
                    <p>• You will receive LP tokens representing your share</p>
                </div>
            </CardContent>
        </Card>
    );
}
