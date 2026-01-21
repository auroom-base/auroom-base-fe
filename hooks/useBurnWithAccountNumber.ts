// Hook: useBurnWithAccountNumber
// Burn IDRX tokens with account number for redeem tracking

'use client';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { BASE_CONTRACTS } from '@/lib/contracts/base_addresses';
import MockIDRXV2ABI from '@/lib/contracts/abis/MockIDRXV2.json';

export function useBurnWithAccountNumber() {
    const { data: hash, writeContract, isPending, error, reset } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const burn = (amount: bigint, accountNumber: string) => {
        writeContract({
            address: BASE_CONTRACTS.IDRX,
            abi: MockIDRXV2ABI,
            functionName: 'burnWithAccountNumber',
            args: [amount, accountNumber],
        });
    };

    return {
        burn,
        hash,
        isPending,
        isConfirming,
        isSuccess,
        error,
        reset,
    };
}
