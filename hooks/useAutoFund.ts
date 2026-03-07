// hooks/useAutoFund.ts
// Watches for wallet connection and automatically calls /api/fund
// to give the user 0.5 ETH gas on the Tenderly VTN.
// Skips if already funded this browser session (localStorage).

'use client'

import { useEffect, useRef } from 'react'
import { useAccount } from 'wagmi'

const BASE_SEPOLIA_CHAIN_ID = 84532

const LS_KEY = 'auroom_funded_addresses'

function getFundedAddresses(): Set<string> {
    try {
        const raw = localStorage.getItem(LS_KEY)
        return new Set(raw ? JSON.parse(raw) : [])
    } catch {
        return new Set()
    }
}

function markAsFunded(address: string) {
    try {
        const set = getFundedAddresses()
        set.add(address.toLowerCase())
        localStorage.setItem(LS_KEY, JSON.stringify([...set]))
    } catch { }
}

export function useAutoFund() {
    const { address, isConnected, chainId } = useAccount()
    const isFunding = useRef(false)

    useEffect(() => {
        // Only run when: connected, on Base Sepolia, have an address
        if (!isConnected || !address || chainId !== BASE_SEPOLIA_CHAIN_ID) return

        // Skip if already funded this session
        const funded = getFundedAddresses()
        if (funded.has(address.toLowerCase())) return

        // Prevent concurrent calls
        if (isFunding.current) return
        isFunding.current = true

        const fund = async () => {
            try {
                const res = await fetch('/api/fund', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ address }),
                })
                const data = await res.json()

                if (data.success) {
                    markAsFunded(address)
                    console.log('[AutoFund] Wallet funded with 0.5 ETH')
                } else {
                    console.warn('[AutoFund] Failed:', data.error)
                }
            } catch (err) {
                console.warn('[AutoFund] Network error:', err)
            } finally {
                isFunding.current = false
            }
        }

        fund()
    }, [address, isConnected, chainId])
}
