import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { IdentityRegistryABI } from '@/lib/contracts/abis';
import { MANTLE_CONTRACTS as CONTRACTS } from '@/lib/contracts/mantle_addresses';
import type { Address } from 'viem';

export function useIdentityRegistry() {
    // Read: Check if address is verified
    const useIsVerified = (address: Address | undefined) => {
        return useReadContract({
            address: CONTRACTS.IdentityRegistry,
            abi: IdentityRegistryABI,
            functionName: 'isVerified',
            args: address ? [address] : undefined,
            query: {
                enabled: !!address,
            },
        }) as { data: boolean | undefined; isLoading: boolean; error: Error | null };
    };

    // Write: Register identity (admin only)
    const { data: hash, writeContract, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const registerIdentity = (addressToRegister: Address) => {
        writeContract({
            address: CONTRACTS.IdentityRegistry,
            abi: IdentityRegistryABI,
            functionName: 'registerIdentity',
            args: [addressToRegister],
        });
    };

    return {
        useIsVerified,
        registerIdentity,
        hash,
        isPending,
        isConfirming,
        isSuccess,
        error,
    };
}
