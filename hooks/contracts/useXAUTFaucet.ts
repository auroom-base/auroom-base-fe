// hooks/contracts/useXAUTFaucet.ts
//
// Faucet hook — calls /api/faucet/mint (BE) to mint 0.01 XAUT.
// The backend owns the XAUT contract and handles IdentityRegistry registration.
// 60-second cooldown enforced via localStorage (mirrors server-side cooldown).

'use client'

import { useAccount, useReadContract } from 'wagmi'
import { BASE_CONTRACTS as CONTRACTS } from '@/lib/contracts/base_addresses'
import MockXAUTABI from '@/lib/contracts/abis/MockXAUT.json'
import { useState, useEffect, useCallback } from 'react'

const COOLDOWN_MS = 60_000
const LS_KEY = 'auroom_faucet_last_drip'

// ── Balance hook ──────────────────────────────────────────────────────────────

export function useXAUTBalance() {
    const { address } = useAccount()

    const { data, isLoading, refetch } = useReadContract({
        address: CONTRACTS.XAUT,
        abi: MockXAUTABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 10000,
        },
    })

    return {
        balance: (data as bigint) ?? 0n,
        isLoading,
        refetch,
    }
}

// ── Faucet hook ───────────────────────────────────────────────────────────────

type FaucetState = 'idle' | 'pending' | 'success' | 'error'

export function useXAUTFaucet() {
    const { address } = useAccount()
    const { refetch: refetchBalance } = useXAUTBalance()

    const [state, setState] = useState<FaucetState>('idle')
    const [txHash, setTxHash] = useState<string | null>(null)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [cooldownSeconds, setCooldownSeconds] = useState(0)

    // Cooldown timer
    useEffect(() => {
        const update = () => {
            const last = parseInt(localStorage.getItem(LS_KEY) ?? '0', 10)
            const elapsed = Date.now() - last
            setCooldownSeconds(Math.max(0, Math.ceil((COOLDOWN_MS - elapsed) / 1000)))
        }
        update()
        const id = setInterval(update, 1000)
        return () => clearInterval(id)
    }, [])

    const drip = useCallback(async () => {
        if (!address || cooldownSeconds > 0 || state === 'pending') return

        setState('pending')
        setErrorMsg(null)
        setTxHash(null)

        try {
            const res = await fetch('/api/faucet/mint', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address }),
            })
            const data = await res.json()

            if (!res.ok) throw new Error(data.error || 'Faucet request failed')

            setTxHash(data.txHash)
            setState('success')
            localStorage.setItem(LS_KEY, Date.now().toString())
            setCooldownSeconds(COOLDOWN_MS / 1000)
            refetchBalance()

        } catch (err: any) {
            setState('error')
            setErrorMsg(err.message)
        }
    }, [address, cooldownSeconds, state, refetchBalance])

    const reset = useCallback(() => {
        setState('idle')
        setErrorMsg(null)
        setTxHash(null)
    }, [])

    return {
        drip,
        reset,
        isPending: state === 'pending',
        isSuccess: state === 'success',
        error: errorMsg ? new Error(errorMsg) : null,
        hash: txHash as `0x${string}` | null,
        cooldownSeconds,
        canDrip: cooldownSeconds === 0 && !!address && state !== 'pending',
    }
}
