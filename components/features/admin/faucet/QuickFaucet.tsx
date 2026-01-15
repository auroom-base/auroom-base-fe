"use client";

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { parseUnits } from 'viem';
import { useMintToken } from '@/hooks/admin/useMintToken';
import { MANTLE_CONTRACTS as CONTRACTS } from '@/lib/contracts/mantle_addresses';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * QuickFaucet - One-click get all test tokens
 */
export function QuickFaucet() {
    const { address } = useAccount();
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = useState<number>(0);

    const {
        mint: mintIDRX,
        isSuccess: idrxSuccess,
        isPending: idrxPending,
        isConfirming: idrxConfirming,
        error: idrxError,
        errorMessage: idrxErrorMessage,
        reset: resetIDRX
    } = useMintToken(CONTRACTS.IDRX);

    const {
        mint: mintUSDC,
        isSuccess: usdcSuccess,
        isPending: usdcPending,
        isConfirming: usdcConfirming,
        error: usdcError,
        errorMessage: usdcErrorMessage,
        reset: resetUSDC
    } = useMintToken(CONTRACTS.USDC);

    const {
        mint: mintXAUT,
        isSuccess: xautSuccess,
        isPending: xautPending,
        isConfirming: xautConfirming,
        error: xautError,
        errorMessage: xautErrorMessage,
        reset: resetXAUT
    } = useMintToken(CONTRACTS.XAUT);

    const isProcessing = idrxPending || idrxConfirming || usdcPending || usdcConfirming || xautPending || xautConfirming;

    // Handle IDRX success
    useEffect(() => {
        if (idrxSuccess && currentStep === 1) {
            toast({
                title: "✅ Step 1/3 Complete",
                description: "1,000,000 IDRX minted successfully",
            });
            setCurrentStep(2);
            // Start USDC mint
            if (address) {
                mintUSDC(address, parseUnits('1000', 6));
            }
        }
    }, [idrxSuccess, currentStep, address, mintUSDC, toast]);

    // Handle USDC success
    useEffect(() => {
        if (usdcSuccess && currentStep === 2) {
            toast({
                title: "✅ Step 2/3 Complete",
                description: "1,000 USDC minted successfully",
            });
            setCurrentStep(3);
            // Start XAUT mint
            if (address) {
                mintXAUT(address, parseUnits('10', 6));
            }
        }
    }, [usdcSuccess, currentStep, address, mintXAUT, toast]);

    // Handle XAUT success
    useEffect(() => {
        if (xautSuccess && currentStep === 3) {
            toast({
                title: "🎉 All Done!",
                description: "All test tokens have been minted to your wallet",
            });
            setCurrentStep(0);
            resetIDRX();
            resetUSDC();
            resetXAUT();
        }
    }, [xautSuccess, currentStep, resetIDRX, resetUSDC, resetXAUT, toast]);

    // Handle errors
    useEffect(() => {
        if (idrxError && idrxErrorMessage && currentStep === 1) {
            toast({
                title: "❌ Step 1/3 Failed",
                description: `IDRX minting failed: ${idrxErrorMessage}`,
                variant: "destructive",
            });
            setCurrentStep(0);
        }
    }, [idrxError, idrxErrorMessage, currentStep, toast]);

    useEffect(() => {
        if (usdcError && usdcErrorMessage && currentStep === 2) {
            toast({
                title: "❌ Step 2/3 Failed",
                description: `USDC minting failed: ${usdcErrorMessage}`,
                variant: "destructive",
            });
            setCurrentStep(0);
        }
    }, [usdcError, usdcErrorMessage, currentStep, toast]);

    useEffect(() => {
        if (xautError && xautErrorMessage && currentStep === 3) {
            toast({
                title: "❌ Step 3/3 Failed",
                description: `XAUT minting failed: ${xautErrorMessage}`,
                variant: "destructive",
            });
            setCurrentStep(0);
        }
    }, [xautError, xautErrorMessage, currentStep, toast]);

    const handleQuickFaucet = () => {
        if (!address) {
            toast({
                title: "Wallet not connected",
                description: "Please connect your wallet first",
                variant: "destructive",
            });
            return;
        }

        setCurrentStep(1);
        toast({
            title: "⏳ Starting Quick Faucet",
            description: "Step 1/3: Minting 1,000,000 IDRX",
        });
        mintIDRX(address, parseUnits('1000000', 6));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Quick Faucet
                </CardTitle>
                <CardDescription>
                    Get all test tokens with one click
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                    <p className="font-medium">You will receive:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>1,000,000 IDRX</li>
                        <li>1,000 USDC</li>
                        <li>10 XAUT (requires admin access)</li>
                    </ul>
                </div>

                <Button
                    onClick={handleQuickFaucet}
                    disabled={!address || isProcessing}
                    className="w-full"
                    size="lg"
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Minting... Step {currentStep}/3
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Get All Test Tokens
                        </>
                    )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                    ⚠️ XAUT minting requires verified address
                </p>
            </CardContent>
        </Card>
    );
}
