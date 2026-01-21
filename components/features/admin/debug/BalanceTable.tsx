"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAllBalances } from '@/hooks/admin/useAllBalances';
import { Wallet, RefreshCw } from 'lucide-react';
import { useBalance } from 'wagmi';
import { formatUnits } from 'viem';

/**
 * BalanceTable - Display all token balances for connected wallet
 */
export function BalanceTable() {
    const { balances, address } = useAllBalances();
    const { data: nativeBalance, refetch: refetchNative } = useBalance({ address });

    const handleRefresh = () => {
        refetchNative();
        // Balances will auto-refresh via wagmi
    };

    const formatBalance = (formatted: string, decimals: number) => {
        const num = parseFloat(formatted);
        if (num === 0) return '0.00';
        if (decimals === 18) {
            // LP tokens
            return num.toFixed(6);
        }
        return num.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6,
        });
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Wallet className="h-5 w-5 text-primary" />
                            All Token Balances
                        </CardTitle>
                        <CardDescription>
                            {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
                        </CardDescription>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                    >
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-lg border">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="p-3 text-left text-sm font-medium">Token</th>
                                <th className="p-3 text-right text-sm font-medium">Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Native ETH */}
                            <tr className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                <td className="p-3 text-sm font-medium">ETH</td>
                                <td className="p-3 text-sm text-right font-mono">
                                    {nativeBalance?.value ? formatBalance(formatUnits(nativeBalance.value, nativeBalance.decimals), 18) : '0.00'}
                                </td>
                            </tr>

                            {/* ERC20 Tokens */}
                            {balances.map((token) => (
                                <tr key={token.symbol} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                    <td className="p-3 text-sm font-medium">{token.symbol}</td>
                                    <td className="p-3 text-sm text-right font-mono">
                                        {formatBalance(token.formatted, token.decimals)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
