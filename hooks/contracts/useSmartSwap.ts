import { useCallback } from 'react';
import { useAccount } from 'wagmi';
import { useSendCalls } from 'wagmi/experimental';
import { encodeFunctionData } from 'viem';
import { ERC20ABI } from '@/lib/contracts/abis';
import { BASE_CONTRACTS as CONTRACTS } from '@/lib/contracts/base_addresses';

// ABI for SwapRouter functions we need
const SWAP_ROUTER_ABI = [
    {
        "inputs": [
            { "name": "amountIn", "type": "uint256" },
            { "name": "amountOutMin", "type": "uint256" },
            { "name": "to", "type": "address" }
        ],
        "name": "swapIDRXtoXAUT",
        "outputs": [{ "name": "amountOut", "type": "uint256" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "name": "amountIn", "type": "uint256" },
            { "name": "amountOutMin", "type": "uint256" },
            { "name": "to", "type": "address" }
        ],
        "name": "swapXAUTtoIDRX",
        "outputs": [{ "name": "amountOut", "type": "uint256" }],
        "stateMutability": "nonpayable",
        "type": "function"
    }
] as const;

export function useSmartSwap() {
    const { address } = useAccount();
    const { sendCalls, error, isPending, data: id, isSuccess } = useSendCalls();

    const smartSwap = useCallback(async ({
        tokenIn,
        amountIn,
        amountOutMin,
        isIdrxToXaut
    }: {
        tokenIn: `0x${string}`;
        amountIn: bigint;
        amountOutMin: bigint;
        isIdrxToXaut: boolean;
    }) => {
        if (!address) return;

        const calls = [];

        // 1. Approve
        calls.push({
            to: tokenIn,
            data: encodeFunctionData({
                abi: ERC20ABI,
                functionName: 'approve',
                args: [CONTRACTS.SwapRouter, amountIn]
            })
        });

        // 2. Swap
        calls.push({
            to: CONTRACTS.SwapRouter,
            data: encodeFunctionData({
                abi: SWAP_ROUTER_ABI,
                functionName: isIdrxToXaut ? 'swapIDRXtoXAUT' : 'swapXAUTtoIDRX',
                args: [amountIn, amountOutMin, address]
            })
        });

        sendCalls({
            calls: calls,
        });
    }, [address, sendCalls]);

    return {
        smartSwap,
        isPending,
        isSuccess,
        error,
        id
    };
}
