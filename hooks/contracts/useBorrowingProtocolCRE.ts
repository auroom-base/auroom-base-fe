// hooks/contracts/useBorrowingProtocolCRE.ts
//
// Hooks for BorrowingProtocolCRE — the Chainlink CRE-integrated version.
// Deployed on Tenderly Virtual TestNet (Base Sepolia fork):
//   0x655B16c3C1145DdF7455aa349E8eE6DD498622be
//
// This hook file mirrors useBorrowingProtocolV2.ts but points to the CRE
// contract and exposes additional CRE-specific functions (isLiquidatable, etc.)

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { BASE_CONTRACTS as CONTRACTS } from '@/lib/contracts/base_addresses';
import { type Abi } from 'viem';
import BorrowingProtocolCREABI from '@/lib/contracts/abis/BorrowingProtocolCRE.json';
const ABI = (BorrowingProtocolCREABI as any).abi as Abi;

const PROTOCOL_ADDRESS = CONTRACTS.BorrowingProtocolCRE;

// ========== READ HOOKS ==========

export function useCollateralBalanceCRE() {
    const { address } = useAccount();

    return useReadContract({
        address: PROTOCOL_ADDRESS,
        abi: ABI,
        functionName: 'collateralBalance',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 10000,
        },
    });
}

export function useDebtBalanceCRE() {
    const { address } = useAccount();

    return useReadContract({
        address: PROTOCOL_ADDRESS,
        abi: ABI,
        functionName: 'debtBalance',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 10000,
        },
    });
}

export function useCollateralValueCRE() {
    const { address } = useAccount();

    return useReadContract({
        address: PROTOCOL_ADDRESS,
        abi: ABI,
        functionName: 'getCollateralValue',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 10000,
        },
    });
}

export function useLTVCRE() {
    const { address } = useAccount();

    return useReadContract({
        address: PROTOCOL_ADDRESS,
        abi: ABI,
        functionName: 'getLTV',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 10000,
        },
    });
}

export function useMaxBorrowCRE() {
    const { address } = useAccount();

    return useReadContract({
        address: PROTOCOL_ADDRESS,
        abi: ABI,
        functionName: 'getMaxBorrow',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 10000,
        },
    });
}

export function useHealthFactorCRE() {
    const { address } = useAccount();

    return useReadContract({
        address: PROTOCOL_ADDRESS,
        abi: ABI,
        functionName: 'getHealthFactor',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 10000,
        },
    });
}

export function useIsAtRiskCRE() {
    const { address } = useAccount();

    return useReadContract({
        address: PROTOCOL_ADDRESS,
        abi: ABI,
        functionName: 'isAtRisk',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 10000,
        },
    });
}

// CRE-specific: isLiquidatable (not in V2)
export function useIsLiquidatableCRE() {
    const { address } = useAccount();

    return useReadContract({
        address: PROTOCOL_ADDRESS,
        abi: ABI,
        functionName: 'isLiquidatable',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 10000,
        },
    });
}

// CRE-specific: getPositionSummary (collateral, debt, ltv, liquidatable) in one call
export function usePositionSummaryCRE() {
    const { address } = useAccount();

    return useReadContract({
        address: PROTOCOL_ADDRESS,
        abi: ABI,
        functionName: 'getPositionSummary',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 10000,
        },
    });
}

// CRE-specific: total active positions
export function useActiveUserCountCRE() {
    return useReadContract({
        address: PROTOCOL_ADDRESS,
        abi: ABI,
        functionName: 'getActiveUserCount',
        query: {
            refetchInterval: 30000,
        },
    });
}

export function useXAUTPriceCRE() {
    const res = useReadContract({
        address: PROTOCOL_ADDRESS,
        abi: ABI,
        functionName: 'xautPriceInIDRX',
        query: {
            refetchInterval: 30000,
        },
    });

    if (res.data !== undefined) {
        console.log('useXAUTPriceCRE RAW DATA:', res.data);
    } else if (res.error) {
        console.error('useXAUTPriceCRE ERROR:', res.error);
    }

    return res;
}

export function useBorrowFeeCRE() {
    return useReadContract({
        address: PROTOCOL_ADDRESS,
        abi: ABI,
        functionName: 'borrowFeeBps',
    });
}

export function useMaxLTVCRE() {
    return useReadContract({
        address: PROTOCOL_ADDRESS,
        abi: ABI,
        functionName: 'MAX_LTV',
    });
}

export function useWarningLTVCRE() {
    return useReadContract({
        address: PROTOCOL_ADDRESS,
        abi: ABI,
        functionName: 'WARNING_LTV',
    });
}

export function useLiquidationLTVCRE() {
    return useReadContract({
        address: PROTOCOL_ADDRESS,
        abi: ABI,
        functionName: 'LIQUIDATION_LTV',
    });
}

// ========== WRITE HOOKS ==========

export function useDepositAndBorrowCRE() {
    const { writeContract, data: hash, isPending, error, reset } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const execute = (collateralAmount: bigint, borrowAmount: bigint) => {
        writeContract({
            address: PROTOCOL_ADDRESS,
            abi: ABI,
            functionName: 'depositAndBorrow',
            args: [collateralAmount, borrowAmount],
        });
    };

    return { execute, isPending, isConfirming, isSuccess, error, hash, reset };
}

export function useRepayAndWithdrawCRE() {
    const { writeContract, data: hash, isPending, error, reset } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const execute = (repayAmount: bigint, withdrawAmount: bigint) => {
        writeContract({
            address: PROTOCOL_ADDRESS,
            abi: ABI,
            functionName: 'repayAndWithdraw',
            args: [repayAmount, withdrawAmount],
        });
    };

    return { execute, isPending, isConfirming, isSuccess, error, hash, reset };
}

export function useClosePositionCRE() {
    const { writeContract, data: hash, isPending, error, reset } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const execute = () => {
        writeContract({
            address: PROTOCOL_ADDRESS,
            abi: ABI,
            functionName: 'closePosition',
        });
    };

    return { execute, isPending, isConfirming, isSuccess, error, hash, reset };
}

// ========== COMBINED POSITION HOOK ==========

export function useUserPositionCRE(): {
    collateral: bigint;
    debt: bigint;
    collateralValue: bigint;
    ltv: bigint;
    maxBorrow: bigint;
    healthFactor: bigint;
    isAtRisk: boolean;
    isLiquidatable: boolean;
    xautPrice: bigint;
    isLoading: boolean;
    refetch: () => void;
} {
    const collateralBalance = useCollateralBalanceCRE();
    const debtBalance = useDebtBalanceCRE();
    const collateralValue = useCollateralValueCRE();
    const ltv = useLTVCRE();
    const maxBorrow = useMaxBorrowCRE();
    const healthFactor = useHealthFactorCRE();
    const isAtRisk = useIsAtRiskCRE();
    const isLiquidatable = useIsLiquidatableCRE();
    const xautPrice = useXAUTPriceCRE();

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
        isLiquidatable.refetch();
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
        isLiquidatable: (isLiquidatable.data as boolean) ?? false,
        xautPrice: (xautPrice.data as bigint) ?? BigInt(0),
        isLoading,
        refetch,
    };
}

// ========== PROTOCOL PARAMS HOOK ==========

export function useProtocolParamsCRE() {
    const maxLTV = useMaxLTVCRE();
    const warningLTV = useWarningLTVCRE();
    const liquidationLTV = useLiquidationLTVCRE();
    const borrowFee = useBorrowFeeCRE();

    return {
        maxLTV: (maxLTV.data as bigint) ?? BigInt(7500),
        warningLTV: (warningLTV.data as bigint) ?? BigInt(8000),
        liquidationLTV: (liquidationLTV.data as bigint) ?? BigInt(9000),
        borrowFee: (borrowFee.data as bigint) ?? BigInt(50),
    };
}
