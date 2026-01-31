import { useCallback, useState } from 'react';
import { useAccount, useSignTypedData, usePublicClient } from 'wagmi';
import { useSendCalls } from 'wagmi/experimental';
import { encodeFunctionData, type Address, maxUint160 } from 'viem';
import { SpendPermissionManagerABI } from '@/lib/contracts/abis/SpendPermissionManagerABI';
import { BASE_CONTRACTS as CONTRACTS } from '@/lib/contracts/base_addresses';

const SPEND_PERMISSION_MANAGER_ADDRESS = CONTRACTS.SpendPermissionManager;

// Define Types
type SpendPermission = {
    account: Address;
    spender: Address;
    token: Address;
    allowance: bigint;
    period: number;
    start: number;
    end: number;
    salt: bigint;
    extraData: `0x${string}`;
};

export function useSpendPermissions() {
    const { address, chainId } = useAccount();
    const { signTypedDataAsync } = useSignTypedData();
    const { sendCalls, isPending, isSuccess, data: id, error } = useSendCalls();
    const [isSigning, setIsSigning] = useState(false);

    const approveAndSpend = useCallback(async ({
        token,
        spender,
        amount,
        targetContract,
        targetFunctionData
    }: {
        token: Address;
        spender: Address; // Who can spend (e.g. SwapRouter)
        amount: bigint;
        targetContract: Address; // Contract to call after approval (usually same as spender)
        targetFunctionData: `0x${string}`; // Encoded function call (e.g. swap...)
    }) => {
        if (!address) return;

        try {
            setIsSigning(true);
            const activeChainId = chainId || 84532; // Default to Base Sepolia logic if undefined

            // 1. Construct Spend Permission
            const now = Math.floor(Date.now() / 1000);
            const permission = {
                account: address,
                spender: spender,
                token: token,
                allowance: BigInt(amount),
                period: 0,
                start: now,
                end: now + 31536000, // 1 year validity (Avoids MaxUint48 UI bugs)
                salt: BigInt(0),
                extraData: '0x' as `0x${string}`
            } as const;

            console.log("Signing Permission:", permission);
            console.log("Domain:", {
                name: 'Spend Permission Manager',
                version: '1',
                chainId: activeChainId,
                verifyingContract: SPEND_PERMISSION_MANAGER_ADDRESS
            });

            // 2. Sign Typed Data (EIP-712)
            const signature = await signTypedDataAsync({
                domain: {
                    name: 'Spend Permission Manager',
                    version: '1',
                    chainId: activeChainId,
                    verifyingContract: SPEND_PERMISSION_MANAGER_ADDRESS,
                },
                types: {
                    SpendPermission: [
                        { name: 'account', type: 'address' },
                        { name: 'spender', type: 'address' },
                        { name: 'token', type: 'address' },
                        { name: 'allowance', type: 'uint160' },
                        { name: 'period', type: 'uint48' },
                        { name: 'start', type: 'uint48' },
                        { name: 'end', type: 'uint48' },
                        { name: 'salt', type: 'uint256' },
                        { name: 'extraData', type: 'bytes' },
                    ],
                },
                primaryType: 'SpendPermission',
                message: permission,
            });

            setIsSigning(false);

            // 3. Batch Calls: ApproveWithSignature + Execute Action
            // Note: We use approveWithSignature to register the permission on-chain.
            // THEN we call the target function.
            // CAUTION: Standard SwapRouter uses `transferFrom`. 
            // It assumes standard ERC20 allowance.
            // SpendPermissionManager works differently: Spender calls Manager.spend().
            // IF SwapRouter is not modified to use Manager.spend(), this might fail 
            // unless we wrap it or use Manager.spend() to push tokens to Router first.

            // STRATEGY: 
            // 1. Register Permission (approveWithSig)
            // 2. Move tokens to SwapRouter via Manager.spend() (Push)
            // 3. Call SwapRouter.swap... (Swap)

            // Check if amount fits in uint160
            const amount160 = amount > maxUint160 ? maxUint160 : amount;

            const calls = [
                // 1. Register Permission
                {
                    to: SPEND_PERMISSION_MANAGER_ADDRESS,
                    data: encodeFunctionData({
                        abi: SpendPermissionManagerABI,
                        functionName: 'approveWithSignature',
                        args: [permission, signature]
                    })
                },
                // 2. Spend (Push to Router)
                // This moves tokens from User -> Spender (Router) using the permission
                {
                    to: SPEND_PERMISSION_MANAGER_ADDRESS,
                    data: encodeFunctionData({
                        abi: SpendPermissionManagerABI,
                        functionName: 'spend',
                        args: [permission, amount160]
                    })
                },
                // 3. Execute Swap
                {
                    to: targetContract,
                    data: targetFunctionData
                }
            ];

            sendCalls({ calls });

        } catch (err) {
            console.error("SpendPermission error:", err);
            setIsSigning(false);
            throw err;
        }
    }, [address, signTypedDataAsync, sendCalls]);

    return {
        approveAndSpend,
        isSigning,
        isPending, // TX pending
        isSuccess,
        data: id,
        error
    };
}
