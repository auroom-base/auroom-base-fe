// app/api/faucet/mint/route.ts
// POST /api/faucet/mint  { address: "0x..." }
// Calls XAUT.mint() on Base Sepolia using the admin wallet (owner of XAUT contract).
// 60-second cooldown tracked server-side.

import { NextRequest, NextResponse } from 'next/server'
import { createWalletClient, createPublicClient, http, parseAbi } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia } from 'viem/chains'

// ── ABIs ──────────────────────────────────────────────────────────────────────
const XAUT_ABI = parseAbi([
    'function balanceOf(address account) external view returns (uint256)',
    'function mint(address to, uint256 amount) external',
])

// ── Config ────────────────────────────────────────────────────────────────────
const XAUT_ADDRESS = (process.env.XAUT_ADDRESS ?? '0x56EeDF50c3C4B47Ca9762298B22Cb86468f834FC') as `0x${string}`
const ADMIN_PRIVATE_KEY = (process.env.ADMIN_PRIVATE_KEY ?? '0x4a829fe6db53f994510699c3a0ba1f633e0e0d9cd9bd13dff9611ed0a287ff68') as `0x${string}`

// XAUT has 6 decimals — drip 0.01 XAUT = 10_000 units
const DRIP_AMOUNT = BigInt(10_000)

const account = privateKeyToAccount(ADMIN_PRIVATE_KEY)
const transport = http()
const publicClient = createPublicClient({ chain: baseSepolia, transport })
const walletClient = createWalletClient({ account, chain: baseSepolia, transport })

// Server-side cooldown: address → last drip timestamp (ms)
const cooldowns = new Map<string, number>()
const COOLDOWN_MS = 60_000

export async function POST(req: NextRequest) {
    try {
        const { address } = await req.json()

        if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
            return NextResponse.json({ error: 'Invalid address' }, { status: 400 })
        }

        // Cooldown check
        const normalized = address.toLowerCase()
        const lastDrip = cooldowns.get(normalized) ?? 0
        const remaining = COOLDOWN_MS - (Date.now() - lastDrip)
        if (remaining > 0) {
            return NextResponse.json(
                { error: `Cooldown active. Try again in ${Math.ceil(remaining / 1000)}s` },
                { status: 429 }
            )
        }

        // Read current XAUT balance for logging
        const currentBalance = await publicClient.readContract({
            address: XAUT_ADDRESS,
            abi: XAUT_ABI,
            functionName: 'balanceOf',
            args: [address as `0x${string}`],
        }) as bigint

        // Call XAUT.mint() — admin wallet is the XAUT contract owner on Base Sepolia
        const hash = await walletClient.writeContract({
            address: XAUT_ADDRESS,
            abi: XAUT_ABI,
            functionName: 'mint',
            args: [address as `0x${string}`, DRIP_AMOUNT],
        })

        cooldowns.set(normalized, Date.now())
        console.log(`[Faucet] Minted 0.01 XAUT to ${address}. Balance was ${currentBalance}. TX: ${hash}`)

        return NextResponse.json({
            success: true,
            amount: '0.01 XAUT',
            hash,
        })

    } catch (err: any) {
        console.error('[Faucet] Error:', err)
        return NextResponse.json(
            { error: err.message || 'Faucet error' },
            { status: 500 }
        )
    }
}
