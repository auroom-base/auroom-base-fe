// hooks/contracts/useBorrowingProtocolV2.ts

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { MANTLE_CONTRACTS as CONTRACTS } from '@/lib/contracts/mantle_addresses';
import BorrowingProtocolV2ABI from '@/lib/contracts/abis/BorrowingProtocolV2.json';

const PROTOCOL_ADDRESS = CONTRACTS.BorrowingProtocolV2;

// ========== READ HOOKS ==========

export function useCollateralBalanceV2() {
    const { address } = useAccount();

    return useReadContract({
        address: PROTOCOL_ADDRESS,
        abi: BorrowingProtocolV2ABI,
        functionName: 'collateralBalance',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 10000,
        },
    });
}

export function useDebtBalanceV2() {
    const { address } = useAccount();

    return useReadContract({
        address: PROTOCOL_ADDRESS,
        abi: BorrowingProtocolV2ABI,
        functionName: 'debtBalance',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 10000,
        },
    });
}

export function useCollateralValueV2() {
    const { address } = useAccount();

    return useReadContract({
        address: PROTOCOL_ADDRESS,
        abi: BorrowingProtocolV2ABI,
        functionName: 'getCollateralValue',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 10000,
        },
    });
}

export function useLTVV2() {
    const { address } = useAccount();

    return useReadContract({
        address: PROTOCOL_ADDRESS,
        abi: BorrowingProtocolV2ABI,
        functionName: 'getLTV',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 10000,
        },
    });
}

export function useMaxBorrowV2() {
    const { address } = useAccount();

    return useReadContract({
        address: PROTOCOL_ADDRESS,
        abi: BorrowingProtocolV2ABI,
        functionName: 'getMaxBorrow',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 10000,
        },
    });
}

export function useHealthFactorV2() {
    const { address } = useAccount();

    return useReadContract({
        address: PROTOCOL_ADDRESS,
        abi: BorrowingProtocolV2ABI,
        functionName: 'getHealthFactor',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 10000,
        },
    });
}

export function useIsAtRiskV2() {
    const { address } = useAccount();

    return useReadContract({
        address: PROTOCOL_ADDRESS,
        abi: BorrowingProtocolV2ABI,
        functionName: 'isAtRisk',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 10000,
        },
    });
}

export function usePreviewDepositAndBorrow(collateralAmount: bigint, borrowAmount: bigint) {
    const { address } = useAccount();

    const result = useReadContract({
        address: PROTOCOL_ADDRESS,
        abi: BorrowingProtocolV2ABI,
        functionName: 'previewDepositAndBorrow',
        args: address && collateralAmount > BigInt(0) && borrowAmount > BigInt(0)
            ? [address, collateralAmount, borrowAmount]
            : undefined,
        query: {
            enabled: !!address && collateralAmount > BigInt(0) && borrowAmount > BigInt(0),
        },
    });

    // DEBUG
    console.log('🔍 usePreviewDepositAndBorrow:', {
        address,
        collateralAmount: collateralAmount.toString(),
        borrowAmount: borrowAmount.toString(),
        enabled: !!address && collateralAmount > BigInt(0) && borrowAmount > BigInt(0),
        data: result.data,
        isLoading: result.isLoading,
        isError: result.isError,
        error: result.error,
    });

    return result;
}

export function usePreviewRepayAndWithdraw(repayAmount: bigint, withdrawAmount: bigint) {
    const { address } = useAccount();

    return useReadContract({
        address: PROTOCOL_ADDRESS,
        abi: BorrowingProtocolV2ABI,
        functionName: 'previewRepayAndWithdraw',
        args: address && (repayAmount > BigInt(0) || withdrawAmount > BigInt(0))
            ? [address, repayAmount, withdrawAmount]
            : undefined,
        query: {
            enabled: !!address && (repayAmount > BigInt(0) || withdrawAmount > BigInt(0)),
        },
    });
}

export function useXAUTPriceV2() {
    return useReadContract({
        address: PROTOCOL_ADDRESS,
        abi: BorrowingProtocolV2ABI,
        functionName: 'xautPriceInIDRX',
        query: {
            refetchInterval: 30000,
        },
    });
}

export function useBorrowFeeV2() {
    return useReadContract({
        address: PROTOCOL_ADDRESS,
        abi: BorrowingProtocolV2ABI,
        functionName: 'borrowFeeBps',
    });
}

export function useMaxLTVV2() {
    return useReadContract({
        address: PROTOCOL_ADDRESS,
        abi: BorrowingProtocolV2ABI,
        functionName: 'MAX_LTV',
    });
}

export function useWarningLTVV2() {
    return useReadContract({
        address: PROTOCOL_ADDRESS,
        abi: BorrowingProtocolV2ABI,
        functionName: 'WARNING_LTV',
    });
}

export function useLiquidationLTVV2() {
    return useReadContract({
        address: PROTOCOL_ADDRESS,
        abi: BorrowingProtocolV2ABI,
        functionName: 'LIQUIDATION_LTV',
    });
}

// ========== WRITE HOOKS ==========

export function useDepositAndBorrow() {
    const { writeContract, data: hash, isPending, error, reset } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const execute = (collateralAmount: bigint, borrowAmount: bigint) => {
        writeContract({
            address: PROTOCOL_ADDRESS,
            abi: BorrowingProtocolV2ABI,
            functionName: 'depositAndBorrow',
            args: [collateralAmount, borrowAmount],
        });
    };

    return {
        execute,
        isPending,
        isConfirming,
        isSuccess,
        error,
        hash,
        reset,
    };
}

export function useRepayAndWithdraw() {
    const { writeContract, data: hash, isPending, error, reset } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const execute = (repayAmount: bigint, withdrawAmount: bigint) => {
        writeContract({
            address: PROTOCOL_ADDRESS,
            abi: BorrowingProtocolV2ABI,
            functionName: 'repayAndWithdraw',
            args: [repayAmount, withdrawAmount],
        });
    };

    return {
        execute,
        isPending,
        isConfirming,
        isSuccess,
        error,
        hash,
        reset,
    };
}

export function useClosePosition() {
    const { writeContract, data: hash, isPending, error, reset } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const execute = () => {
        writeContract({
            address: PROTOCOL_ADDRESS,
            abi: BorrowingProtocolV2ABI,
            functionName: 'closePosition',
        });
    };

    return {
        execute,
        isPending,
        isConfirming,
        isSuccess,
        error,
        hash,
        reset,
    };
}

// ========== COMBINED POSITION HOOK ==========

export function useUserPositionV2(): {
    collateral: bigint;
    debt: bigint;
    collateralValue: bigint;
    ltv: bigint;
    maxBorrow: bigint;
    healthFactor: bigint;
    isAtRisk: boolean;
    xautPrice: bigint;
    isLoading: boolean;
    refetch: () => void;
} {
    const collateralBalance = useCollateralBalanceV2();
    const debtBalance = useDebtBalanceV2();
    const collateralValue = useCollateralValueV2();
    const ltv = useLTVV2();
    const maxBorrow = useMaxBorrowV2();
    const healthFactor = useHealthFactorV2();
    const isAtRisk = useIsAtRiskV2();
    const xautPrice = useXAUTPriceV2();

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
        xautPrice.refetch();
    };

    return {
        collateral: (collateralBalance.data as bigint) ?? BigInt(0),
        debt: (debtBalance.data as bigint) ?? BigInt(0),
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

// ========== PROTOCOL PARAMS HOOK ==========

export function useProtocolParamsV2() {
    const maxLTV = useMaxLTVV2();
    const warningLTV = useWarningLTVV2();
    const liquidationLTV = useLiquidationLTVV2();
    const borrowFee = useBorrowFeeV2();

    return {
        maxLTV: (maxLTV.data as bigint) ?? BigInt(7500),
        warningLTV: (warningLTV.data as bigint) ?? BigInt(8000),
        liquidationLTV: (liquidationLTV.data as bigint) ?? BigInt(9000),
        borrowFee: (borrowFee.data as bigint) ?? BigInt(50),
    };
}
