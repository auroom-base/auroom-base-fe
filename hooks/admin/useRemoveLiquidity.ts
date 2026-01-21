import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { UniswapV2RouterABI } from '@/lib/contracts/abis/UniswapV2Router';
import { BASE_CONTRACTS as CONTRACTS } from '@/lib/contracts/base_addresses';

export interface RemoveLiquidityParams {
    tokenA: `0x${string}`;
    tokenB: `0x${string}`;
    liquidity: bigint;
    amountAMin: bigint;
    amountBMin: bigint;
    to: `0x${string}`;
    deadline: bigint;
}

export function useRemoveLiquidity() {
    const {
        writeContract,
        data: hash,
        isPending: isWritePending,
        isSuccess: isWriteSuccess,
        error: writeError
    } = useWriteContract();

    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed
    } = useWaitForTransactionReceipt({
        hash,
    });

    const removeLiquidity = (params: RemoveLiquidityParams) => {
        writeContract({
            address: CONTRACTS.UniswapV2Router,
            abi: UniswapV2RouterABI,
            functionName: 'removeLiquidity',
            args: [
                params.tokenA,
                params.tokenB,
                params.liquidity,
                params.amountAMin,
                params.amountBMin,
                params.to,
                params.deadline,
            ],
        });
    };

    return {
        removeLiquidity,
        hash,
        isPending: isWritePending,
        isConfirming,
        isSuccess: isConfirmed,
        error: writeError,
    };
}
