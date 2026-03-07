// app/api/kyc/status/route.ts
// GET /api/kyc/status?wallet=0x...
// Returns current KYC level for a wallet by reading from IdentityRegistryV2 on Base Sepolia

import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http, parseAbi } from 'viem'
import { baseSepolia } from 'viem/chains'

const REGISTRY_ABI = parseAbi([
    'function getKycLevel(address user) external view returns (uint8)',
])
const REGISTRY_ADDRESS = (process.env.IDENTITY_REGISTRY_V2 ?? '0x655b16c3c1145ddf7455aa349e8ee6dd498622be') as `0x${string}`

const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(),  // wagmi built-in Base Sepolia public RPC
})

export async function GET(req: NextRequest) {
    const wallet = req.nextUrl.searchParams.get('wallet')

    if (!wallet || !/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
        return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
    }

    try {
        const level = await publicClient.readContract({
            address: REGISTRY_ADDRESS,
            abi: REGISTRY_ABI,
            functionName: 'getKycLevel',
            args: [wallet as `0x${string}`],
        })

        return NextResponse.json({ wallet, level: Number(level) })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

