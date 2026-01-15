"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTokenAllowance } from '@/hooks/contracts/useTokenAllowance';
import { MANTLE_CONTRACTS as CONTRACTS } from '@/lib/contracts/mantle_addresses';
import { TOKENS } from '@/lib/contracts/tokens';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import { RefreshCw, Shield } from 'lucide-react';

/**
 * AllowanceTable - Display all token allowances for common spenders
 */
export function AllowanceTable() {
    const { address } = useAccount();

    const spenders = [
        { name: 'Swap Router', address: CONTRACTS.SwapRouter },
        { name: 'Uniswap V2 Router', address: CONTRACTS.UniswapV2Router },
        { name: 'Borrowing Protocol V2', address: CONTRACTS.BorrowingProtocolV2 },
    ];

    const tokens = [
        { symbol: 'IDRX', address: TOKENS.IDRX.address, decimals: TOKENS.IDRX.decimals },
        { symbol: 'USDC', address: TOKENS.USDC.address, decimals: TOKENS.USDC.decimals },
        { symbol: 'XAUT', address: TOKENS.XAUT.address, decimals: TOKENS.XAUT.decimals },
    ];

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            Token Allowances
                        </CardTitle>
                        <CardDescription>
                            {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-lg border overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="p-3 text-left text-sm font-medium">Token</th>
                                {spenders.map((spender) => (
                                    <th key={spender.address} className="p-3 text-right text-sm font-medium">
                                        {spender.name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tokens.map((token) => (
                                <tr key={token.address} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                    <td className="p-3 text-sm font-medium">{token.symbol}</td>
                                    {spenders.map((spender) => (
                                        <AllowanceCell
                                            key={`${token.address}-${spender.address}`}
                                            tokenAddress={token.address}
                                            spenderAddress={spender.address}
                                            decimals={token.decimals}
                                            userAddress={address}
                                        />
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 text-xs text-muted-foreground space-y-1">
                    <p>• Allowances show how much each contract can spend on your behalf</p>
                    <p>• "Unlimited" means maximum approval (2^256 - 1)</p>
                </div>
            </CardContent>
        </Card>
    );
}

/**
 * AllowanceCell - Individual cell showing allowance for a token-spender pair
 */
function AllowanceCell({
    tokenAddress,
    spenderAddress,
    decimals,
    userAddress,
}: {
    tokenAddress: `0x${string}`;
    spenderAddress: `0x${string}`;
    decimals: number;
    userAddress: `0x${string}` | undefined;
}) {
    const { data: allowance } = useTokenAllowance(tokenAddress, userAddress, spenderAddress);

    const formatAllowance = (value: bigint | undefined) => {
        if (!value) return '0';

        // Check if it's max uint256 (unlimited approval)
        const maxUint256 = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
        if (value >= maxUint256 / BigInt(2)) {
            return '∞';
        }

        const formatted = formatUnits(value, decimals);
        const num = parseFloat(formatted);

        if (num === 0) return '0';
        if (num < 0.0001) return '<0.0001';
        if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;

        return num.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 4,
        });
    };

    return (
        <td className="p-3 text-sm text-right font-mono">
            {allowance !== undefined ? formatAllowance(allowance as bigint) : '-'}
        </td>
    );
}
