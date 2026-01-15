"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePoolReserves } from '@/hooks/admin/usePoolReserves';
import { MANTLE_CONTRACTS as CONTRACTS } from '@/lib/contracts/mantle_addresses';
import { TOKENS } from '@/lib/contracts/tokens';
import { formatUnits } from 'viem';
import { Droplets, TrendingUp } from 'lucide-react';

interface PoolData {
    name: string;
    pairAddress: `0x${string}`;
    token0Symbol: string;
    token1Symbol: string;
    token0Decimals: number;
    token1Decimals: number;
}

const POOLS: PoolData[] = [
    {
        name: 'IDRX/USDC',
        pairAddress: CONTRACTS.IDRX_USDC_Pair,
        token0Symbol: 'IDRX',
        token1Symbol: 'USDC',
        token0Decimals: TOKENS.IDRX.decimals,
        token1Decimals: TOKENS.USDC.decimals,
    },
    {
        name: 'XAUT/USDC',
        pairAddress: CONTRACTS.XAUT_USDC_Pair,
        token0Symbol: 'XAUT',
        token1Symbol: 'USDC',
        token0Decimals: TOKENS.XAUT.decimals,
        token1Decimals: TOKENS.USDC.decimals,
    },
];

/**
 * PoolCard - Display individual pool statistics
 */
function PoolCard({ pool }: { pool: PoolData }) {
    const { reserve0, reserve1, token0, token1, isLoading } = usePoolReserves(pool.pairAddress);

    // Determine which reserve corresponds to which token
    const token0Address = token0?.toLowerCase();
    const token1Address = token1?.toLowerCase();

    // Get token info based on actual token addresses from pair
    const getTokenInfo = (address: string | undefined) => {
        if (!address) return null;
        const addr = address.toLowerCase();
        if (addr === TOKENS.IDRX.address.toLowerCase()) return { symbol: 'IDRX', decimals: TOKENS.IDRX.decimals };
        if (addr === TOKENS.USDC.address.toLowerCase()) return { symbol: 'USDC', decimals: TOKENS.USDC.decimals };
        if (addr === TOKENS.XAUT.address.toLowerCase()) return { symbol: 'XAUT', decimals: TOKENS.XAUT.decimals };
        return null;
    };

    const tokenInfo0 = getTokenInfo(token0Address);
    const tokenInfo1 = getTokenInfo(token1Address);

    const reserve0Formatted = reserve0 && tokenInfo0
        ? parseFloat(formatUnits(reserve0, tokenInfo0.decimals)).toLocaleString('en-US', { maximumFractionDigits: 2 })
        : '0';

    const reserve1Formatted = reserve1 && tokenInfo1
        ? parseFloat(formatUnits(reserve1, tokenInfo1.decimals)).toLocaleString('en-US', { maximumFractionDigits: 2 })
        : '0';

    // Calculate price (token1 per token0)
    const price = reserve0 && reserve1 && tokenInfo0 && tokenInfo1 && reserve0 > BigInt(0)
        ? (Number(formatUnits(reserve1, tokenInfo1.decimals)) / Number(formatUnits(reserve0, tokenInfo0.decimals)))
        : 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-primary" />
                    {pool.name} Pool
                </CardTitle>
                <CardDescription>Liquidity pool reserves and stats</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="text-center text-muted-foreground py-4">Loading pool data...</div>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">{tokenInfo0?.symbol || pool.token0Symbol} Reserve</p>
                                <p className="text-xl font-bold">{reserve0Formatted}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{tokenInfo1?.symbol || pool.token1Symbol} Reserve</p>
                                <p className="text-xl font-bold">{reserve1Formatted}</p>
                            </div>
                        </div>

                        <div className="pt-3 border-t">
                            <p className="text-sm text-muted-foreground">Price</p>
                            <p className="text-lg font-semibold">
                                1 {tokenInfo0?.symbol || pool.token0Symbol} = {price.toFixed(6)} {tokenInfo1?.symbol || pool.token1Symbol}
                            </p>
                        </div>

                        <div className="p-3 rounded-lg bg-muted/50">
                            <p className="text-xs text-muted-foreground mb-1">Pool Address</p>
                            <p className="text-xs font-mono break-all">{pool.pairAddress}</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

/**
 * PoolOverview - Display all liquidity pools
 */
export function PoolOverview() {
    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold mb-2">Liquidity Pools</h3>
                <p className="text-sm text-muted-foreground">
                    Overview of all Uniswap V2 liquidity pools
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {POOLS.map((pool) => (
                    <PoolCard key={pool.pairAddress} pool={pool} />
                ))}
            </div>
        </div>
    );
}
