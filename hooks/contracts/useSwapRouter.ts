import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { SwapRouterABI } from '@/lib/contracts/abis';
import { BASE_CONTRACTS as CONTRACTS } from '@/lib/contracts/base_addresses';
import { calculateDeadline } from '@/lib/utils/calculations';
import type { Address } from 'viem';

export function useSwapRouter() {
    // Read: Get quote for IDRX to XAUT
    const useQuoteIDRXtoXAUT = (amountIn: bigint | undefined) => {
        return useReadContract({
            address: CONTRACTS.SwapRouter,
            abi: SwapRouterABI,
            functionName: 'getQuoteIDRXtoXAUT',
            args: amountIn ? [amountIn] : undefined,
            query: {
                enabled: !!amountIn && amountIn > BigInt(0),
                refetchInterval: 5000, // Refetch every 5 seconds
            },
        });
    };

    // Read: Get quote for XAUT to IDRX
    const useQuoteXAUTtoIDRX = (amountIn: bigint | undefined) => {
        return useReadContract({
            address: CONTRACTS.SwapRouter,
            abi: SwapRouterABI,
            functionName: 'getQuoteXAUTtoIDRX',
            args: amountIn ? [amountIn] : undefined,
            query: {
                enabled: !!amountIn && amountIn > BigInt(0),
                refetchInterval: 5000,
            },
        });
    };

    // Write: Swap IDRX to XAUT
    const { data: hash, writeContract, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const swapIDRXtoXAUT = (
        amountIn: bigint,
        amountOutMin: bigint,
        to: Address,
        deadlineMinutes: number = 20
    ) => {
        const deadline = calculateDeadline(deadlineMinutes);

        writeContract({
            address: CONTRACTS.SwapRouter,
            abi: SwapRouterABI,
            functionName: 'swapIDRXtoXAUT',
            args: [amountIn, amountOutMin, to, deadline],
        });
    };

    const swapXAUTtoIDRX = (
        amountIn: bigint,
        amountOutMin: bigint,
        to: Address,
        deadlineMinutes: number = 20
    ) => {
        const deadline = calculateDeadline(deadlineMinutes);

        writeContract({
            address: CONTRACTS.SwapRouter,
            abi: SwapRouterABI,
            functionName: 'swapXAUTtoIDRX',
            args: [amountIn, amountOutMin, to, deadline],
        });
    };

    return {
        useQuoteIDRXtoXAUT,
        useQuoteXAUTtoIDRX,
        swapIDRXtoXAUT,
        swapXAUTtoIDRX,
        hash,
        isPending,
        isConfirming,
        isSuccess,
        error,
    };
}
