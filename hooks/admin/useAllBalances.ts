import { useReadContract, useAccount } from 'wagmi';
import { MockTokenABI } from '@/lib/contracts/abis/MockToken';
import { UniswapV2PairABI } from '@/lib/contracts/abis/UniswapV2Pair';
import { BASE_CONTRACTS as CONTRACTS } from '@/lib/contracts/base_addresses';
import { formatUnits } from 'viem';

export interface TokenBalance {
    symbol: string;
    address: `0x${string}`;
    balance: bigint;
    formatted: string;
    decimals: number;
}

/**
 * Hook to fetch all token balances for the connected wallet
 * Note: GoldVault/gXAUT removed from this deployment
 */
export function useAllBalances() {
    const { address } = useAccount();

    // IDRX Balance
    const { data: idrxBalance } = useReadContract({
        address: CONTRACTS.IDRX,
        abi: MockTokenABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: { enabled: !!address },
    });

    // USDC Balance
    const { data: usdcBalance } = useReadContract({
        address: CONTRACTS.USDC,
        abi: MockTokenABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: { enabled: !!address },
    });

    // XAUT Balance
    const { data: xautBalance } = useReadContract({
        address: CONTRACTS.XAUT,
        abi: MockTokenABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: { enabled: !!address },
    });

    // IDRX/USDC LP Balance
    const { data: idrxUsdcLpBalance } = useReadContract({
        address: CONTRACTS.IDRX_USDC_Pair,
        abi: UniswapV2PairABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: { enabled: !!address },
    });

    // XAUT/USDC LP Balance
    const { data: xautUsdcLpBalance } = useReadContract({
        address: CONTRACTS.XAUT_USDC_Pair,
        abi: UniswapV2PairABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: { enabled: !!address },
    });

    const balances: TokenBalance[] = [
        {
            symbol: 'IDRX',
            address: CONTRACTS.IDRX,
            balance: idrxBalance || BigInt(0),
            formatted: formatUnits(idrxBalance || BigInt(0), 6),
            decimals: 6,
        },
        {
            symbol: 'USDC',
            address: CONTRACTS.USDC,
            balance: usdcBalance || BigInt(0),
            formatted: formatUnits(usdcBalance || BigInt(0), 6),
            decimals: 6,
        },
        {
            symbol: 'XAUT',
            address: CONTRACTS.XAUT,
            balance: xautBalance || BigInt(0),
            formatted: formatUnits(xautBalance || BigInt(0), 6),
            decimals: 6,
        },
        {
            symbol: 'LP-IDRX/USDC',
            address: CONTRACTS.IDRX_USDC_Pair,
            balance: idrxUsdcLpBalance || BigInt(0),
            formatted: formatUnits(idrxUsdcLpBalance || BigInt(0), 18),
            decimals: 18,
        },
        {
            symbol: 'LP-XAUT/USDC',
            address: CONTRACTS.XAUT_USDC_Pair,
            balance: xautUsdcLpBalance || BigInt(0),
            formatted: formatUnits(xautUsdcLpBalance || BigInt(0), 18),
            decimals: 18,
        },
    ];

    return { balances, address };
}
