'use client';

import { useEffect, useState, useRef } from 'react';
import type { SimulationResult } from '@/hooks/useSimulateDeposit';

export function useSimulateRepay(
    from: string | undefined,
    repayAmount: bigint,
    withdrawAmount: bigint,
    skip: boolean, // skip when needsApproval=true (same pattern as deposit)
) {
    const [result, setResult] = useState<SimulationResult>({ status: 'idle' });
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!from || repayAmount === 0n || skip) {
            setResult({ status: 'idle' });
            return;
        }

        setResult({ status: 'loading' });

        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(async () => {
            try {
                const res = await fetch('/api/simulate/repay', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        from,
                        repayAmount: repayAmount.toString(),
                        withdrawAmount: withdrawAmount.toString(),
                    }),
                });
                const data = await res.json();
                if (data.error) { setResult({ status: 'error', message: data.error }); return; }
                if (data.success) {
                    setResult({ status: 'success', gasUsed: data.gasUsed });
                } else {
                    setResult({ status: 'reverted', reason: data.revertReason ?? 'Transaction would revert' });
                }
            } catch (err: any) {
                setResult({ status: 'error', message: err.message ?? 'Simulation failed' });
            }
        }, 600);

        return () => { if (timer.current) clearTimeout(timer.current); };
    }, [from, repayAmount, withdrawAmount, skip]);

    return result;
}
