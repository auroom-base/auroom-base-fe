// hooks/contracts/useIdentityRegistryV2.ts
//
// Hooks for IdentityRegistryV2 — tiered KYC (Level 0 / 1 / 2)
// Deployed on Tenderly Virtual TestNet:
//   0x54166b2C5e09f16c3c1D705FfB4eb29a069000A9

'use client'

import { useReadContract, useAccount } from 'wagmi'
import { useState, useEffect } from 'react'
import { BASE_CONTRACTS as CONTRACTS } from '@/lib/contracts/base_addresses'
import IdentityRegistryV2ABI from '@/lib/contracts/abis/IdentityRegistryV2.json'

const REGISTRY_ADDRESS = CONTRACTS.IdentityRegistryV2

export type KycLevel = 0 | 1 | 2

export interface KycLimits {
    maxCollateral: bigint   // in XAUT wei (1e18)
    maxBorrow: bigint       // in IDRX (1e6)
    maxLtv: bigint          // basis points (5000 = 50%)
    liquidationLtv: bigint  // basis points
    label: string
}

const UNLIMITED = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')

// Limit lookup (mirrors the contract constants — kept in sync)
export const TIER_LIMITS: Record<KycLevel, KycLimits> = {
    0: {
        maxCollateral: BigInt('100000000000000000'),  // 0.1 XAUT
        maxBorrow: BigInt('5000000000000'),        // 5M IDRX (1e6 decimals)
        maxLtv: 5000n,
        liquidationLtv: 8000n,
        label: 'Guest',
    },
    1: {
        maxCollateral: BigInt('500000000000000000'),  // 0.5 XAUT
        maxBorrow: BigInt('50000000000000'),       // 50M IDRX
        maxLtv: 6000n,
        liquidationLtv: 8500n,
        label: 'Basic KYC',
    },
    2: {
        maxCollateral: UNLIMITED,
        maxBorrow: UNLIMITED,
        maxLtv: 7500n,
        liquidationLtv: 9000n,
        label: 'Enhanced KYC',
    },
}

/**
 * Get current KYC level for connected wallet (0 | 1 | 2)
 * Reads via /api/kyc/status (BE) instead of direct chain read for reliability.
 */
export function useKycLevel() {
    const { address } = useAccount()
    const [level, setLevel] = useState<KycLevel>(0)
    const [isLoading, setIsLoading] = useState(false)
    const [fetchKey, setFetchKey] = useState(0)

    useEffect(() => {
        if (!address) return
        setIsLoading(true)

        fetch(`/api/kyc/status?wallet=${address}`)
            .then(r => r.json())
            .then(data => {
                if (typeof data.level === 'number') {
                    setLevel(data.level as KycLevel)
                }
            })
            .catch(() => {/* keep level 0 */ })
            .finally(() => setIsLoading(false))
    }, [address, fetchKey])

    const refetch = () => setFetchKey((k: number) => k + 1)

    return {
        level,
        limits: TIER_LIMITS[level as KycLevel],
        isLoading,
        refetch,
    }
}


/**
 * Get KYC level for an arbitrary address (e.g. for admin dashboard)
 */
export function useKycLevelOf(address: `0x${string}` | undefined) {
    const { data, isLoading, refetch } = useReadContract({
        address: REGISTRY_ADDRESS,
        abi: IdentityRegistryV2ABI,
        functionName: 'getKycLevel',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        },
    })

    const level = (typeof data === 'number' ? data : Number(data ?? 0)) as KycLevel

    return { level, limits: TIER_LIMITS[level], isLoading, refetch }
}

/**
 * Check if connected wallet is verified (level >= 1) — V1 backward compat
 */
export function useIsVerified() {
    const { address } = useAccount()

    const { data, isLoading } = useReadContract({
        address: REGISTRY_ADDRESS,
        abi: IdentityRegistryV2ABI,
        functionName: 'isVerified',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 15000,
        },
    })

    return { isVerified: (data as boolean) ?? false, isLoading }
}
