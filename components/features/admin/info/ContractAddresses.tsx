"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MANTLE_CONTRACTS as CONTRACTS } from '@/lib/contracts/mantle_addresses';
import { Copy, ExternalLink, FileJson } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EXPLORER_URL = "https://sepolia.mantlescan.xyz";

interface ContractInfo {
    name: string;
    address: string;
    category: string;
}

const CONTRACT_LIST: ContractInfo[] = [
    { name: 'IDRX', address: CONTRACTS.IDRX, category: 'Tokens' },
    { name: 'USDC', address: CONTRACTS.USDC, category: 'Tokens' },
    { name: 'XAUT', address: CONTRACTS.XAUT, category: 'Tokens' },
    { name: 'Identity Registry', address: CONTRACTS.IdentityRegistry, category: 'Infrastructure' },
    { name: 'Uniswap V2 Factory', address: CONTRACTS.UniswapV2Factory, category: 'Infrastructure' },
    { name: 'Uniswap V2 Router', address: CONTRACTS.UniswapV2Router, category: 'Infrastructure' },
    { name: 'IDRX/USDC Pair', address: CONTRACTS.IDRX_USDC_Pair, category: 'Liquidity Pairs' },
    { name: 'XAUT/USDC Pair', address: CONTRACTS.XAUT_USDC_Pair, category: 'Liquidity Pairs' },
    { name: 'Swap Router', address: CONTRACTS.SwapRouter, category: 'Protocol' },
    { name: 'Borrowing Protocol V2', address: CONTRACTS.BorrowingProtocolV2, category: 'Protocol' },
];

/**
 * ContractAddresses - Display all contract addresses with copy and explorer links
 */
export function ContractAddresses() {
    const { toast } = useToast();

    const copyToClipboard = (address: string, name: string) => {
        navigator.clipboard.writeText(address);
        toast({
            title: "Copied!",
            description: `${name} address copied to clipboard`,
        });
    };

    const openInExplorer = (address: string) => {
        window.open(`${EXPLORER_URL}/address/${address}`, '_blank', 'noopener,noreferrer');
    };

    const copyAllAsJSON = () => {
        const json = JSON.stringify(CONTRACTS, null, 2);
        navigator.clipboard.writeText(json);
        toast({
            title: "Copied!",
            description: "All contract addresses copied as JSON",
        });
    };

    const groupedContracts = CONTRACT_LIST.reduce((acc, contract) => {
        if (!acc[contract.category]) {
            acc[contract.category] = [];
        }
        acc[contract.category].push(contract);
        return acc;
    }, {} as Record<string, ContractInfo[]>);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Contract Addresses</CardTitle>
                <CardDescription>
                    All deployed contract addresses on Base Sepolia
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {Object.entries(groupedContracts).map(([category, contracts]) => (
                    <div key={category} className="space-y-3">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                            {category}
                        </h3>
                        <div className="space-y-2">
                            {contracts.map((contract) => (
                                <div
                                    key={contract.address}
                                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm">{contract.name}</p>
                                        <p className="text-xs text-muted-foreground font-mono truncate">
                                            {contract.address}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => copyToClipboard(contract.address, contract.name)}
                                            title="Copy address"
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openInExplorer(contract.address)}
                                            title="View on explorer"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="pt-4 border-t">
                    <Button
                        variant="outline"
                        onClick={copyAllAsJSON}
                        className="w-full"
                    >
                        <FileJson className="mr-2 h-4 w-4" />
                        Copy All Addresses as JSON
                    </Button>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                    <p>📋 = Copy to clipboard</p>
                    <p>🔗 = View on Explorer</p>
                </div>
            </CardContent>
        </Card>
    );
}
