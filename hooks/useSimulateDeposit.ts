// hooks/useSimulateDeposit.ts
// Calls /api/simulate/deposit and returns the pre-flight result.
// Debounced — only fires 600ms after the user stops changing the amount.

'use client';

import { useEffect, useState, useRef } from 'react';

export type SimulationResult =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; gasUsed: number }
    | { status: 'reverted'; reason: string }
    | { status: 'error'; message: string };

export function useSimulateDeposit(
    from: string | undefined,
    collateralAmount: bigint,
    borrowAmount: bigint,
) {
    const [result, setResult] = useState<SimulationResult>({ status: 'idle' });
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // Reset if no wallet or zero amounts
        if (!from || collateralAmount === 0n || borrowAmount === 0n) {
            setResult({ status: 'idle' });
            return;
        }

        setResult({ status: 'loading' });

        // Debounce — wait 600ms after last change
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(async () => {
            try {
                const res = await fetch('/api/simulate/deposit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        from,
                        collateralAmount: collateralAmount.toString(),
                        borrowAmount: borrowAmount.toString(),
                    }),
                });

                const data = await res.json();

                if (data.error) {
                    setResult({ status: 'error', message: data.error });
                    return;
                }

                if (data.success) {
                    setResult({ status: 'success', gasUsed: data.gasUsed });
                } else {
                    setResult({ status: 'reverted', reason: data.revertReason ?? 'Transaction would revert' });
                }
            } catch (err: any) {
                setResult({ status: 'error', message: err.message ?? 'Simulation failed' });
            }
        }, 600);

        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, [from, collateralAmount, borrowAmount]);

    return result;
}
