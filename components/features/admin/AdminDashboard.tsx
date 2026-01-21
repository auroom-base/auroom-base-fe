"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAllBalances } from '@/hooks/admin/useAllBalances';
import { useIdentityRegistry } from '@/hooks/contracts/useIdentityRegistry';
import { useAccount, useBalance } from 'wagmi';
import { Coins, Shield } from 'lucide-react';

/**
 * AdminDashboard - Overview dashboard with key stats
 * Note: GoldVault functionality has been removed from this deployment
 */
export function AdminDashboard() {
    const { address } = useAccount();
    const { balances } = useAllBalances();
    const { data: nativeBalance } = useBalance({ address });
    const { useIsVerified } = useIdentityRegistry();
    const { data: isVerified } = useIsVerified(address);

    const idrxBalance = balances.find(b => b.symbol === 'IDRX');
    const usdcBalance = balances.find(b => b.symbol === 'USDC');
    const xautBalance = balances.find(b => b.symbol === 'XAUT');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Helper Tools</h1>
                <p className="text-muted-foreground mt-2">
                    Testing and debugging utilities for AuRoom Protocol
                </p>
            </div>

            {/* User Info */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Connected Wallet</p>
                            <p className="font-mono text-sm">
                                {address ? `${address.slice(0, 10)}...${address.slice(-8)}` : 'Not connected'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Verification Status</p>
                            <p className="text-sm font-medium">
                                {isVerified ? (
                                    <span className="text-green-600 dark:text-green-400">✓ Verified</span>
                                ) : (
                                    <span className="text-amber-600 dark:text-amber-400">⚠ Not Verified</span>
                                )}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Network</p>
                            <p className="text-sm font-medium">Base Sepolia (84532)</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Native Balance</p>
                            <p className="text-sm font-medium">
                                {nativeBalance ? parseFloat(nativeBalance.formatted).toFixed(4) : '0.0000'} ETH
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Coins className="h-4 w-4 text-rose-500" />
                            IDRX
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {idrxBalance ? parseFloat(idrxBalance.formatted).toLocaleString('en-US', { maximumFractionDigits: 2 }) : '0.00'}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Indonesian Rupiah</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Coins className="h-4 w-4 text-blue-500" />
                            USDC
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {usdcBalance ? parseFloat(usdcBalance.formatted).toLocaleString('en-US', { maximumFractionDigits: 2 }) : '0.00'}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">USD Coin</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Coins className="h-4 w-4 text-amber-500" />
                            XAUT
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {xautBalance ? parseFloat(xautBalance.formatted).toFixed(6) : '0.000000'}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Tether Gold</p>
                    </CardContent>
                </Card>
            </div>

            {/* Protocol Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Shield className="h-4 w-4 text-blue-500" />
                        Protocol Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Network</p>
                            <p className="font-medium">Base Sepolia Testnet</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Chain ID</p>
                            <p className="font-medium font-mono">84532</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
