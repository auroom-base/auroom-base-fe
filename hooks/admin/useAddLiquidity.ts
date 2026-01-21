import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { UniswapV2RouterABI } from '@/lib/contracts/abis/UniswapV2Router';
import { BASE_CONTRACTS as CONTRACTS } from '@/lib/contracts/base_addresses';

export interface AddLiquidityParams {
    tokenA: `0x${string}`;
    tokenB: `0x${string}`;
    amountADesired: bigint;
    amountBDesired: bigint;
    amountAMin: bigint;
    amountBMin: bigint;
    to: `0x${string}`;
    deadline: bigint;
}

export function useAddLiquidity() {
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

    const addLiquidity = (params: AddLiquidityParams) => {
        writeContract({
            address: CONTRACTS.UniswapV2Router,
            abi: UniswapV2RouterABI,
            functionName: 'addLiquidity',
            args: [
                params.tokenA,
                params.tokenB,
                params.amountADesired,
                params.amountBDesired,
                params.amountAMin,
                params.amountBMin,
                params.to,
                params.deadline,
            ],
        });
    };

    return {
        addLiquidity,
        hash,
        isPending: isWritePending,
        isConfirming,
        isSuccess: isConfirmed,
        error: writeError,
    };
}
