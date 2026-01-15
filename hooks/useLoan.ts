/**
 * Loan Hooks for Pinjam Tunai
 * 
 * Simplified hooks that wrap existing BorrowingProtocolV2 hooks
 * with user-friendly naming and fixed 30% LTV
 */

'use client';

import { useAccount } from 'wagmi';
import { useTokenBalance } from './contracts/useTokenBalance';
import {
    useXAUTPriceV2,
    useBorrowFeeV2,
    useUserPositionV2,
    useDepositAndBorrow,
    useRepayAndWithdraw,
    useClosePosition,
} from './contracts/useBorrowingProtocolV2';
import {
    useXAUTAllowanceV2,
    useXAUTApproveV2,
    useIDRXAllowanceV2,
    useIDRXApproveV2,
} from './contracts/useTokenApprovalsV2';
import { MANTLE_CONTRACTS as CONTRACTS } from '@/lib/contracts/mantle_addresses';
import { calculateLoan, calculateMaxLoan } from '@/lib/utils/loanCalculations';

/**
 * Get user's gold (XAUT) balance
 */
export function useGoldBalance() {
    const { address } = useAccount();
    const { data: balance, isLoading, refetch } = useTokenBalance(CONTRACTS.XAUT, address);

    return {
        balance: (balance as bigint) || 0n,
        isLoading,
        refetch,
    };
}

/**
 * Get gold (XAUT) price in IDRX
 */
export function useGoldPrice() {
    const { data: price, isLoading } = useXAUTPriceV2();

    return {
        price: (price as bigint) || 0n,
        isLoading,
    };
}

/**
 * Get active loan position
 */
export function useActiveLoan() {
    const position = useUserPositionV2();

    const hasActiveLoan = position.debt > 0n;

    return {
        collateral: position.collateral,
        debt: position.debt,
        collateralValue: position.collateralValue,
        ltv: position.ltv,
        hasActiveLoan,
        isLoading: position.isLoading,
        refetch: position.refetch,
    };
}

/**
 * Get IDRX balance (for repayment)
 */
export function useIDRXBalance() {
    const { address } = useAccount();
    const { data: balance, isLoading, refetch } = useTokenBalance(CONTRACTS.IDRX, address);

    return {
        balance: (balance as bigint) || 0n,
        isLoading,
        refetch,
    };
}

/**
 * Get loan calculation based on input amount
 */
export function useLoanCalculation(loanAmount: bigint, ltvBps: number = 3000) {
    const { balance: xautBalance } = useGoldBalance();
    const { price: xautPrice } = useGoldPrice();
    const { data: feeBps } = useBorrowFeeV2();

    const calculation = calculateLoan(
        loanAmount,
        xautPrice,
        xautBalance,
        ltvBps,
        Number((feeBps as bigint) || 50n)
    );

    const maxLoan = calculateMaxLoan(xautBalance, xautPrice, ltvBps);

    return {
        ...calculation,
        maxLoan,
    };
}

/**
 * XAUT approval hooks
 */
export function useXAUTApproval() {
    const { data: allowance, refetch } = useXAUTAllowanceV2();
    const approve = useXAUTApproveV2();

    return {
        allowance: (allowance as bigint) || 0n,
        refetchAllowance: refetch,
        approve: approve.approve,
        isPending: approve.isPending,
        isConfirming: approve.isConfirming,
        isSuccess: approve.isSuccess,
        error: approve.error,
        hash: approve.hash,
    };
}

/**
 * IDRX approval hooks (for repayment)
 */
export function useIDRXApproval() {
    const { data: allowance, refetch } = useIDRXAllowanceV2();
    const approve = useIDRXApproveV2();

    return {
        allowance: (allowance as bigint) || 0n,
        refetchAllowance: refetch,
        approve: approve.approve,
        isPending: approve.isPending,
        isConfirming: approve.isConfirming,
        isSuccess: approve.isSuccess,
        error: approve.error,
        hash: approve.hash,
    };
}

/**
 * Deposit and borrow hook
 */
export function useBorrow() {
    const borrow = useDepositAndBorrow();

    return {
        execute: borrow.execute,
        isPending: borrow.isPending,
        isConfirming: borrow.isConfirming,
        isSuccess: borrow.isSuccess,
        error: borrow.error,
        hash: borrow.hash,
        reset: borrow.reset,
    };
}

/**
 * Repay hook (supports partial and full repayment)
 */
export function useRepay() {
    const repay = useRepayAndWithdraw();

    return {
        execute: repay.execute,
        isPending: repay.isPending,
        isConfirming: repay.isConfirming,
        isSuccess: repay.isSuccess,
        error: repay.error,
        hash: repay.hash,
        reset: repay.reset,
    };
}

/**
 * Close position hook (for full repayment - closes entire position)
 */
export function useClosePositionHook() {
    const close = useClosePosition();

    return {
        execute: close.execute,
        isPending: close.isPending,
        isConfirming: close.isConfirming,
        isSuccess: close.isSuccess,
        error: close.error,
        hash: close.hash,
        reset: close.reset,
    };
}
