"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MANTLE_CONTRACTS as CONTRACTS } from '@/lib/contracts/mantle_addresses';
import { TOKENS } from '@/lib/contracts/tokens';
import { parseUnits, formatUnits } from 'viem';
import { useReadContract } from 'wagmi';
import { UniswapV2RouterABI } from '@/lib/contracts/abis/UniswapV2Router';
import { Calculator, ArrowRight } from 'lucide-react';

type TokenSymbol = 'IDRX' | 'USDC' | 'XAUT';

/**
 * PriceCalculator - Calculate swap quotes using Uniswap V2 Router
 */
export function PriceCalculator() {
    const [tokenIn, setTokenIn] = useState<TokenSymbol>('IDRX');
    const [tokenOut, setTokenOut] = useState<TokenSymbol>('USDC');
    const [amountIn, setAmountIn] = useState('');

    const tokenInInfo = TOKENS[tokenIn];
    const tokenOutInfo = TOKENS[tokenOut];

    // Parse input amount
    const parsedAmountIn = amountIn && !isNaN(parseFloat(amountIn))
        ? parseUnits(amountIn, tokenInInfo.decimals)
        : BigInt(0);

    // Get quote from router
    const { data: amountsOut, isLoading, error } = useReadContract({
        address: CONTRACTS.UniswapV2Router,
        abi: UniswapV2RouterABI,
        functionName: 'getAmountsOut',
        args: parsedAmountIn > BigInt(0) ? [parsedAmountIn, [tokenInInfo.address, tokenOutInfo.address]] : undefined,
        query: {
            enabled: parsedAmountIn > BigInt(0),
        },
    });

    // Extract output amount
    const amountOut = amountsOut && Array.isArray(amountsOut) && amountsOut.length > 1
        ? amountsOut[1]
        : BigInt(0);

    const amountOutFormatted = amountOut > BigInt(0)
        ? formatUnits(amountOut as bigint, tokenOutInfo.decimals)
        : '0';

    // Calculate price
    const price = parsedAmountIn > BigInt(0) && amountOut > BigInt(0)
        ? parseFloat(amountOutFormatted) / parseFloat(amountIn)
        : 0;

    // Calculate price impact (simplified)
    const priceImpact = 0; // Would need pool reserves to calculate accurately

    const handleSwapDirection = () => {
        setTokenIn(tokenOut);
        setTokenOut(tokenIn);
        setAmountIn('');
    };

    const presetAmounts = ['1', '10', '100', '1000'];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-primary" />
                    Price Calculator
                </CardTitle>
                <CardDescription>
                    Get swap quotes from Uniswap V2 Router
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Token In */}
                <div className="space-y-2">
                    <Label>From</Label>
                    <div className="grid grid-cols-2 gap-2">
                        <Select value={tokenIn} onValueChange={(value) => setTokenIn(value as TokenSymbol)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="IDRX">IDRX</SelectItem>
                                <SelectItem value="USDC">USDC</SelectItem>
                                <SelectItem value="XAUT">XAUT</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input
                            type="number"
                            placeholder="0.0"
                            value={amountIn}
                            onChange={(e) => setAmountIn(e.target.value)}
                            step="any"
                        />
                    </div>
                </div>

                {/* Swap Direction Button */}
                <div className="flex justify-center">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSwapDirection}
                        className="rounded-full"
                    >
                        <ArrowRight className="h-4 w-4 rotate-90" />
                    </Button>
                </div>

                {/* Token Out */}
                <div className="space-y-2">
                    <Label>To</Label>
                    <div className="grid grid-cols-2 gap-2">
                        <Select value={tokenOut} onValueChange={(value) => setTokenOut(value as TokenSymbol)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="IDRX">IDRX</SelectItem>
                                <SelectItem value="USDC">USDC</SelectItem>
                                <SelectItem value="XAUT">XAUT</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input
                            type="text"
                            value={amountOutFormatted}
                            readOnly
                            className="bg-muted"
                        />
                    </div>
                </div>

                {/* Preset Amounts */}
                <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Quick Amounts</Label>
                    <div className="grid grid-cols-4 gap-2">
                        {presetAmounts.map((amount) => (
                            <Button
                                key={amount}
                                variant="outline"
                                size="sm"
                                onClick={() => setAmountIn(amount)}
                            >
                                {amount}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Quote Info */}
                {parsedAmountIn > BigInt(0) && amountOut > BigInt(0) && (
                    <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Rate</span>
                            <span className="font-medium">
                                1 {tokenIn} = {price.toFixed(6)} {tokenOut}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Inverse Rate</span>
                            <span className="font-medium">
                                1 {tokenOut} = {(1 / price).toFixed(6)} {tokenIn}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Route</span>
                            <span className="font-mono text-xs">
                                {tokenIn} → {tokenOut}
                            </span>
                        </div>
                    </div>
                )}

                {/* Loading/Error States */}
                {isLoading && (
                    <div className="text-center text-sm text-muted-foreground">
                        Calculating quote...
                    </div>
                )}

                {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-800 dark:text-red-200">
                        <p className="font-medium">Error calculating quote</p>
                        <p className="text-xs mt-1">Make sure there's liquidity for this pair</p>
                    </div>
                )}

                {/* Info */}
                <div className="text-xs text-muted-foreground space-y-1">
                    <p>• Quotes are fetched from Uniswap V2 Router</p>
                    <p>• Actual swap amounts may vary due to slippage</p>
                    <p>• Only direct pairs are supported (no multi-hop)</p>
                </div>
            </CardContent>
        </Card>
    );
}
