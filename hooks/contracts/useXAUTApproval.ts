// hooks/contracts/useXAUTApproval.ts

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { MANTLE_CONTRACTS as CONTRACTS } from '@/lib/contracts/mantle_addresses';
import { ERC20ABI } from '@/lib/contracts/abis';

export function useXAUTAllowance() {
    const { address } = useAccount();

    return useReadContract({
        address: CONTRACTS.XAUT,
        abi: ERC20ABI,
        functionName: 'allowance',
        args: address ? [address, CONTRACTS.BorrowingProtocol] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 5000,
        },
    });
}

export function useXAUTApprove() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const approve = (amount: bigint) => {
        writeContract({
            address: CONTRACTS.XAUT,
            abi: ERC20ABI,
            functionName: 'approve',
            args: [CONTRACTS.BorrowingProtocol, amount],
        });
    };

    return {
        approve,
        isPending,
        isConfirming,
        isSuccess,
        error,
        hash,
    };
}

export function useIDRXAllowance() {
    const { address } = useAccount();

    return useReadContract({
        address: CONTRACTS.IDRX,
        abi: ERC20ABI,
        functionName: 'allowance',
        args: address ? [address, CONTRACTS.BorrowingProtocol] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 5000,
        },
    });
}

export function useIDRXApprove() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const approve = (amount: bigint) => {
        writeContract({
            address: CONTRACTS.IDRX,
            abi: ERC20ABI,
            functionName: 'approve',
            args: [CONTRACTS.BorrowingProtocol, amount],
        });
    };

    return {
        approve,
        isPending,
        isConfirming,
        isSuccess,
        error,
        hash,
    };
}
