// app/api/fund/route.ts
// POST /api/fund  { address: "0x..." }
// Sends 0.005 ETH from admin wallet to the user on real Base Sepolia.
// In-memory dedup prevents repeat funding.

import { NextRequest, NextResponse } from 'next/server'
import { createWalletClient, createPublicClient, http, parseEther, defineChain } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia } from 'viem/chains'

const ADMIN_PRIVATE_KEY = (process.env.ADMIN_PRIVATE_KEY ?? '0x4a829fe6db53f994510699c3a0ba1f633e0e0d9cd9bd13dff9611ed0a287ff68') as `0x${string}`
const FUND_AMOUNT = parseEther('0.005') // 0.005 ETH — enough for many txs on Base Sepolia

const account = privateKeyToAccount(ADMIN_PRIVATE_KEY)
const transport = http()
const publicClient = createPublicClient({ chain: baseSepolia, transport })
const walletClient = createWalletClient({ account, chain: baseSepolia, transport })

// In-memory dedup — resets on server restart (fine for hackathon)
const funded = new Set<string>()

export async function POST(req: NextRequest) {
    try {
        const { address } = await req.json()

        if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
            return NextResponse.json({ error: 'Invalid address' }, { status: 400 })
        }

        const normalized = address.toLowerCase()

        // Already funded this session
        if (funded.has(normalized)) {
            return NextResponse.json({ success: true, skipped: true })
        }

        // Check current balance — skip if already has enough gas (> 0.002 ETH)
        const balance = await publicClient.getBalance({ address: address as `0x${string}` })
        if (balance >= parseEther('0.002')) {
            funded.add(normalized)
            return NextResponse.json({ success: true, skipped: true, reason: 'already funded' })
        }

        // Send ETH from admin wallet
        const hash = await walletClient.sendTransaction({
            to: address as `0x${string}`,
            value: FUND_AMOUNT,
        })

        // Don't wait for receipt — fire & forget is fine for faucet
        funded.add(normalized)
        console.log(`[AutoFund] Sent 0.005 ETH to ${address} on Base Sepolia. TX: ${hash}`)

        return NextResponse.json({ success: true, address, amount: '0.005 ETH', hash })

    } catch (err: any) {
        console.error('[AutoFund] Error:', err.message)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
