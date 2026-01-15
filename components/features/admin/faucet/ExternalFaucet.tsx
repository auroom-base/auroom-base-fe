"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Droplet } from 'lucide-react';

const MANTLE_FAUCET_URL = "https://faucet.sepolia.mantle.xyz";

/**
 * ExternalFaucet - Link to Mantle Sepolia MNT faucet
 */
export function ExternalFaucet() {
    const openFaucet = () => {
        window.open(MANTLE_FAUCET_URL, '_blank', 'noopener,noreferrer');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Droplet className="h-5 w-5 text-primary" />
                    Native Token (MNT)
                </CardTitle>
                <CardDescription>
                    Get MNT for gas fees
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    Need MNT for gas fees? Get testnet MNT from the official Mantle Sepolia faucet.
                </p>

                <Button
                    onClick={openFaucet}
                    variant="outline"
                    className="w-full"
                >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open Mantle Sepolia Faucet
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                    {MANTLE_FAUCET_URL}
                </p>
            </CardContent>
        </Card>
    );
}
