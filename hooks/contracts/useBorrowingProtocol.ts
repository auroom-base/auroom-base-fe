// hooks/contracts/useBorrowingProtocol.ts

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { BASE_CONTRACTS as CONTRACTS } from '@/lib/contracts/base_addresses';
import BorrowingProtocolABI from '@/lib/contracts/abis/BorrowingProtocol.json';

// ========== READ HOOKS ==========

export function useCollateralBalance() {
    const { address } = useAccount();

    return useReadContract({
        address: CONTRACTS.BorrowingProtocol,
        abi: BorrowingProtocolABI,
        functionName: 'collateralBalance',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 10000, // Refetch every 10s
        },
    });
}

export function useDebtBalance() {
    const { address } = useAccount();

    return useReadContract({
        address: CONTRACTS.BorrowingProtocol,
        abi: BorrowingProtocolABI,
        functionName: 'debtBalance',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 10000,
        },
    });
}

export function useCollateralValue() {
    const { address } = useAccount();

    return useReadContract({
        address: CONTRACTS.BorrowingProtocol,
        abi: BorrowingProtocolABI,
        functionName: 'getCollateralValue',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 10000,
        },
    });
}

export function useLTV() {
    const { address } = useAccount();

    return useReadContract({
        address: CONTRACTS.BorrowingProtocol,
        abi: BorrowingProtocolABI,
        functionName: 'getLTV',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 10000,
        },
    });
}

export function useMaxBorrow() {
    const { address } = useAccount();

    return useReadContract({
        address: CONTRACTS.BorrowingProtocol,
        abi: BorrowingProtocolABI,
        functionName: 'getMaxBorrow',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 10000,
        },
    });
}

export function useHealthFactor() {
    const { address } = useAccount();

    return useReadContract({
        address: CONTRACTS.BorrowingProtocol,
        abi: BorrowingProtocolABI,
        functionName: 'getHealthFactor',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 10000,
        },
    });
}

export function useIsAtRisk() {
    const { address } = useAccount();

    return useReadContract({
        address: CONTRACTS.BorrowingProtocol,
        abi: BorrowingProtocolABI,
        functionName: 'isAtRisk',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 10000,
        },
    });
}

export function usePreviewBorrow(amount: bigint) {
    const { address } = useAccount();

    return useReadContract({
        address: CONTRACTS.BorrowingProtocol,
        abi: BorrowingProtocolABI,
        functionName: 'previewBorrow',
        args: address && amount > BigInt(0) ? [address, amount] : undefined,
        query: {
            enabled: !!address && amount > BigInt(0),
        },
    });
}

export function usePreviewWithdraw(amount: bigint) {
    const { address } = useAccount();

    return useReadContract({
        address: CONTRACTS.BorrowingProtocol,
        abi: BorrowingProtocolABI,
        functionName: 'previewWithdraw',
        args: address && amount > BigInt(0) ? [address, amount] : undefined,
        query: {
            enabled: !!address && amount > BigInt(0),
        },
    });
}

export function useXAUTPrice() {
    return useReadContract({
        address: CONTRACTS.BorrowingProtocol,
        abi: BorrowingProtocolABI,
        functionName: 'xautPriceInIDRX',
        query: {
            refetchInterval: 30000, // Refetch every 30s
        },
    });
}

export function useBorrowFee() {
    return useReadContract({
        address: CONTRACTS.BorrowingProtocol,
        abi: BorrowingProtocolABI,
        functionName: 'borrowFeeBps',
    });
}

// ========== WRITE HOOKS ==========

export function useDepositCollateral() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const deposit = (amount: bigint) => {
        writeContract({
            address: CONTRACTS.BorrowingProtocol,
            abi: BorrowingProtocolABI,
            functionName: 'depositCollateral',
            args: [amount],
        });
    };

    return {
        deposit,
        isPending,
        isConfirming,
        isSuccess,
        error,
        hash,
    };
}

export function useWithdrawCollateral() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const withdraw = (amount: bigint) => {
        writeContract({
            address: CONTRACTS.BorrowingProtocol,
            abi: BorrowingProtocolABI,
            functionName: 'withdrawCollateral',
            args: [amount],
        });
    };

    return {
        withdraw,
        isPending,
        isConfirming,
        isSuccess,
        error,
        hash,
    };
}

export function useBorrow() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const borrow = (amount: bigint) => {
        writeContract({
            address: CONTRACTS.BorrowingProtocol,
            abi: BorrowingProtocolABI,
            functionName: 'borrow',
            args: [amount],
        });
    };

    return {
        borrow,
        isPending,
        isConfirming,
        isSuccess,
        error,
        hash,
    };
}

export function useRepay() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const repay = (amount: bigint) => {
        writeContract({
            address: CONTRACTS.BorrowingProtocol,
            abi: BorrowingProtocolABI,
            functionName: 'repay',
            args: [amount],
        });
    };

    return {
        repay,
        isPending,
        isConfirming,
        isSuccess,
        error,
        hash,
    };
}

export function useRepayFull() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const repayFull = () => {
        writeContract({
            address: CONTRACTS.BorrowingProtocol,
            abi: BorrowingProtocolABI,
            functionName: 'repayFull',
        });
    };

    return {
        repayFull,
        isPending,
        isConfirming,
        isSuccess,
        error,
        hash,
    };
}

// ========== COMBINED POSITION HOOK ==========

export function useUserPosition(): {
    collateralBalance: bigint;
    debtBalance: bigint;
    collateralValue: bigint;
    ltv: bigint;
    maxBorrow: bigint;
    healthFactor: bigint;
    isAtRisk: boolean;
    xautPrice: bigint;
    isLoading: boolean;
    refetch: () => void;
} {
    const collateralBalance = useCollateralBalance();
    const debtBalance = useDebtBalance();
    const collateralValue = useCollateralValue();
    const ltv = useLTV();
    const maxBorrow = useMaxBorrow();
    const healthFactor = useHealthFactor();
    const isAtRisk = useIsAtRisk();
    const xautPrice = useXAUTPrice();

    const isLoading =
        collateralBalance.isLoading ||
        debtBalance.isLoading ||
        collateralValue.isLoading ||
        ltv.isLoading;

    const refetch = () => {
        collateralBalance.refetch();
        debtBalance.refetch();
        collateralValue.refetch();
        ltv.refetch();
        maxBorrow.refetch();
        healthFactor.refetch();
        isAtRisk.refetch();
    };

    return {
        collateralBalance: (collateralBalance.data as bigint) ?? BigInt(0),
        debtBalance: (debtBalance.data as bigint) ?? BigInt(0),
        collateralValue: (collateralValue.data as bigint) ?? BigInt(0),
        ltv: (ltv.data as bigint) ?? BigInt(0),
        maxBorrow: (maxBorrow.data as bigint) ?? BigInt(0),
        healthFactor: (healthFactor.data as bigint) ?? BigInt(0),
        isAtRisk: (isAtRisk.data as boolean) ?? false,
        xautPrice: (xautPrice.data as bigint) ?? BigInt(0),
        isLoading,
        refetch,
    };
}
