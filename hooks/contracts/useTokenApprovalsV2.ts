// hooks/contracts/useTokenApprovalsV2.ts

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { BASE_CONTRACTS as CONTRACTS } from '@/lib/contracts/base_addresses';
import { ERC20ABI } from '@/lib/contracts/abis';

// ========== XAUT APPROVAL FOR V2 ==========

export function useXAUTAllowanceV2() {
    const { address } = useAccount();

    return useReadContract({
        address: CONTRACTS.XAUT,
        abi: ERC20ABI,
        functionName: 'allowance',
        args: address ? [address, CONTRACTS.BorrowingProtocolV2] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 5000,
        },
    });
}

export function useXAUTApproveV2() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const approve = (amount: bigint) => {
        writeContract({
            address: CONTRACTS.XAUT,
            abi: ERC20ABI,
            functionName: 'approve',
            args: [CONTRACTS.BorrowingProtocolV2, amount],
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

// ========== IDRX APPROVAL FOR V2 ==========

export function useIDRXAllowanceV2() {
    const { address } = useAccount();

    return useReadContract({
        address: CONTRACTS.IDRX,
        abi: ERC20ABI,
        functionName: 'allowance',
        args: address ? [address, CONTRACTS.BorrowingProtocolV2] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 5000,
        },
    });
}

export function useIDRXApproveV2() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const approve = (amount: bigint) => {
        writeContract({
            address: CONTRACTS.IDRX,
            abi: ERC20ABI,
            functionName: 'approve',
            args: [CONTRACTS.BorrowingProtocolV2, amount],
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
