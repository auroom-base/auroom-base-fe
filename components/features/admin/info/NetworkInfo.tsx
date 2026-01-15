"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NETWORK_INFO = {
    name: "Mantle Sepolia Testnet",
    chainId: 5003,
    chainIdHex: "0x138B",
    currency: "MNT",
    rpcUrl: "https://rpc.sepolia.mantle.xyz",
    explorer: "https://sepolia.mantlescan.xyz",
    faucet: "https://faucet.sepolia.mantle.xyz",
};

/**
 * NetworkInfo - Display network information and MetaMask integration
 */
export function NetworkInfo() {
    const { toast } = useToast();

    const addToMetaMask = async () => {
        if (typeof window.ethereum === 'undefined') {
            toast({
                title: "MetaMask not found",
                description: "Please install MetaMask to add this network",
                variant: "destructive",
            });
            return;
        }

        try {
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                    {
                        chainId: NETWORK_INFO.chainIdHex,
                        chainName: NETWORK_INFO.name,
                        nativeCurrency: {
                            name: NETWORK_INFO.currency,
                            symbol: NETWORK_INFO.currency,
                            decimals: 18,
                        },
                        rpcUrls: [NETWORK_INFO.rpcUrl],
                        blockExplorerUrls: [NETWORK_INFO.explorer],
                    },
                ],
            });

            toast({
                title: "Success!",
                description: "Mantle Sepolia network added to MetaMask",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to add network to MetaMask",
                variant: "destructive",
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    Network Information
                </CardTitle>
                <CardDescription>
                    Mantle Sepolia testnet details
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Network Name</p>
                        <p className="text-sm font-mono">{NETWORK_INFO.name}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Chain ID</p>
                        <p className="text-sm font-mono">{NETWORK_INFO.chainId}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Currency</p>
                        <p className="text-sm font-mono">{NETWORK_INFO.currency}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">RPC URL</p>
                        <p className="text-sm font-mono text-xs break-all">{NETWORK_INFO.rpcUrl}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Explorer</p>
                        <a
                            href={NETWORK_INFO.explorer}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-mono text-xs break-all text-primary hover:underline"
                        >
                            {NETWORK_INFO.explorer}
                        </a>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Faucet</p>
                        <a
                            href={NETWORK_INFO.faucet}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-mono text-xs break-all text-primary hover:underline"
                        >
                            {NETWORK_INFO.faucet}
                        </a>
                    </div>
                </div>

                <div className="pt-4 border-t">
                    <Button
                        onClick={addToMetaMask}
                        variant="outline"
                        className="w-full"
                    >
                        <Wallet className="mr-2 h-4 w-4" />
                        Add Network to MetaMask
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
