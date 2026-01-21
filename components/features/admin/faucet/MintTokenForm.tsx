"use client";

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { parseUnits, isAddress } from 'viem';
import { useMintToken } from '@/hooks/admin/useMintToken';
import { useCheckOwner } from '@/hooks/admin/useCheckOwner';
import { BASE_CONTRACTS as CONTRACTS } from '@/lib/contracts/base_addresses';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Coins, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type TokenType = 'IDRX' | 'USDC' | 'XAUT';

const TOKEN_LIMITS = {
    IDRX: { min: 1, default: 1000000, max: 100000000 },
    USDC: { min: 1, default: 1000, max: 1000000 },
    XAUT: { min: 0.01, default: 10, max: 1000 },
};

/**
 * MintTokenForm - Individual token minting form
 */
export function MintTokenForm() {
    const { address: connectedAddress } = useAccount();
    const { toast } = useToast();

    const [selectedToken, setSelectedToken] = useState<TokenType>('IDRX');
    const [amount, setAmount] = useState('');
    const [recipient, setRecipient] = useState('');
    const [useConnectedWallet, setUseConnectedWallet] = useState(true);

    const tokenAddress = CONTRACTS[selectedToken];
    const { mint, isPending, isConfirming, isSuccess, hash, error, errorMessage, reset } = useMintToken(tokenAddress);
    const { owner, isOwner, isLoading: isCheckingOwner } = useCheckOwner(tokenAddress);

    const limits = TOKEN_LIMITS[selectedToken];

    // Handle success
    useEffect(() => {
        if (isSuccess && hash) {
            toast({
                title: "✅ Success!",
                description: `Successfully minted ${amount} ${selectedToken}. Tx: ${hash.slice(0, 10)}...${hash.slice(-8)}`,
            });
            // Reset form
            setAmount('');
            reset();
        }
    }, [isSuccess, hash, amount, selectedToken, toast, reset]);

    // Handle errors
    useEffect(() => {
        if (error && errorMessage) {
            toast({
                title: "❌ Minting Failed",
                description: hash
                    ? `${errorMessage}. Tx: ${hash.slice(0, 10)}...${hash.slice(-8)}`
                    : errorMessage,
                variant: "destructive",
            });
        }
    }, [error, errorMessage, hash, toast]);

    const handleMint = () => {
        const finalRecipient = useConnectedWallet ? connectedAddress : recipient;

        if (!finalRecipient || !isAddress(finalRecipient)) {
            toast({
                title: "Invalid recipient",
                description: "Please provide a valid Ethereum address",
                variant: "destructive",
            });
            return;
        }

        const amountNum = parseFloat(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            toast({
                title: "Invalid amount",
                description: "Please enter a valid amount",
                variant: "destructive",
            });
            return;
        }

        if (amountNum < limits.min || amountNum > limits.max) {
            toast({
                title: "Amount out of range",
                description: `Amount must be between ${limits.min} and ${limits.max.toLocaleString()} ${selectedToken}`,
                variant: "destructive",
            });
            return;
        }

        const amountBigInt = parseUnits(amount, 6);
        mint(finalRecipient as `0x${string}`, amountBigInt);

        toast({
            title: "⏳ Transaction Submitted",
            description: `Minting ${amount} ${selectedToken}...`,
        });
    };

    const setSuggestedAmount = (value: number) => {
        setAmount(value.toString());
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Coins className="h-5 w-5 text-primary" />
                    Mint Individual Tokens
                </CardTitle>
                <CardDescription>
                    Select token and amount to mint
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="token">Token</Label>
                    <Select value={selectedToken} onValueChange={(value) => setSelectedToken(value as TokenType)}>
                        <SelectTrigger id="token">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="IDRX">IDRX</SelectItem>
                            <SelectItem value="USDC">USDC</SelectItem>
                            <SelectItem value="XAUT">XAUT</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="flex gap-2">
                        <Input
                            id="amount"
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            min={limits.min}
                            max={limits.max}
                            step={selectedToken === 'XAUT' ? '0.01' : '1'}
                        />
                        <Button
                            variant="outline"
                            onClick={() => setSuggestedAmount(limits.max)}
                        >
                            MAX
                        </Button>
                    </div>
                    <div className="flex gap-2 text-xs">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSuggestedAmount(selectedToken === 'IDRX' ? 1000000 : selectedToken === 'USDC' ? 1000 : 10)}
                        >
                            {selectedToken === 'IDRX' ? '1M' : selectedToken === 'USDC' ? '1K' : '10'}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSuggestedAmount(selectedToken === 'IDRX' ? 10000000 : selectedToken === 'USDC' ? 10000 : 100)}
                        >
                            {selectedToken === 'IDRX' ? '10M' : selectedToken === 'USDC' ? '10K' : '100'}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSuggestedAmount(selectedToken === 'IDRX' ? 100000000 : selectedToken === 'USDC' ? 100000 : 1000)}
                        >
                            {selectedToken === 'IDRX' ? '100M' : selectedToken === 'USDC' ? '100K' : '1K'}
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient</Label>
                    <Input
                        id="recipient"
                        placeholder="0x..."
                        value={useConnectedWallet ? (connectedAddress || '') : recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        disabled={useConnectedWallet}
                    />
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="useConnected"
                            checked={useConnectedWallet}
                            onCheckedChange={(checked) => setUseConnectedWallet(checked as boolean)}
                        />
                        <label
                            htmlFor="useConnected"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Use connected wallet
                        </label>
                    </div>
                </div>

                {error && errorMessage && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                        <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                        <div className="flex-1 text-sm">
                            <p className="font-medium text-destructive">Error</p>
                            <p className="text-destructive/90">{errorMessage}</p>
                        </div>
                    </div>
                )}

                {isSuccess && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
                        <div className="flex-1 text-sm">
                            <p className="font-medium text-green-600 dark:text-green-400">Success!</p>
                            <p className="text-green-600/90 dark:text-green-400/90">Tokens minted successfully</p>
                        </div>
                    </div>
                )}

                {!isCheckingOwner && !isOwner && connectedAddress && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                        <div className="flex-1 text-sm">
                            <p className="font-medium text-amber-600 dark:text-amber-400">Not Contract Owner</p>
                            <p className="text-amber-600/90 dark:text-amber-400/90">
                                You are not the owner of this contract. Minting will fail.
                            </p>
                            {owner && (
                                <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-1">
                                    Owner: {owner.slice(0, 6)}...{owner.slice(-4)}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <Button
                    onClick={handleMint}
                    disabled={!amount || isPending || isConfirming}
                    className="w-full"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Waiting for approval...
                        </>
                    ) : isConfirming ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Confirming transaction...
                        </>
                    ) : (
                        `Mint ${selectedToken}`
                    )}
                </Button>

                {selectedToken === 'XAUT' && (
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                        ⚠️ XAUT minting requires recipient to be verified
                    </p>
                )}
            </CardContent>
        </Card >
    );
}
