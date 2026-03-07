// app/api/kyc/submit/route.ts
//
// POST /api/kyc/submit
// Accepts multipart/form-data with KYC fields.
// Validates fields server-side, then calls IdentityRegistryV2.setKycLevel()
// using the admin private key. Returns { success, txHash, newLevel }.

import { NextRequest, NextResponse } from 'next/server'
import { createWalletClient, createPublicClient, http, parseAbi, defineChain } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

const tenderlyVTN = defineChain({ id: 99984532, name: 'AuRoom Testnet (Tenderly)', network: 'tenderly-vtn', nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 }, rpcUrls: { default: { http: [process.env.TENDERLY_ADMIN_RPC ?? ''] } } });

// ── ABI (minimal) ────────────────────────────────────────────────────────────
const REGISTRY_ABI = parseAbi([
    'function setKycLevel(address user, uint8 level) external',
    'function getKycLevel(address user) external view returns (uint8)',
])

const REGISTRY_ADDRESS = (process.env.IDENTITY_REGISTRY_V2 ?? '') as `0x${string}`
const ADMIN_RPC = process.env.TENDERLY_ADMIN_RPC ?? ''

// ── Validation helpers ────────────────────────────────────────────────────────

function isValidWallet(addr: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(addr)
}

function isValidPhone(phone: string): boolean {
    return /^(\+62|08)\d{8,11}$/.test(phone.replace(/\s/g, ''))
}

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidNIK(nik: string): boolean {
    return /^\d{16}$/.test(nik)
}

function isAdult(dob: string): boolean {
    const birth = new Date(dob)
    const age = (Date.now() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    return age >= 18
}

function isValidFile(file: File | null): boolean {
    if (!file) return false
    const allowed = ['image/jpeg', 'image/png', 'application/pdf']
    return allowed.includes(file.type) && file.size <= 5 * 1024 * 1024 // 5MB
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        // ── Parse form data
        const form = await req.formData()

        const walletAddress = (form.get('walletAddress') as string)?.trim()
        const targetLevel = parseInt(form.get('targetLevel') as string, 10)
        const fullName = (form.get('fullName') as string)?.trim()
        const phone = (form.get('phone') as string)?.trim()
        const email = (form.get('email') as string)?.trim()
        const selfie = form.get('selfie') as File | null

        // ── Common validations
        if (!isValidWallet(walletAddress)) {
            return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
        }
        if (![1, 2].includes(targetLevel)) {
            return NextResponse.json({ error: 'Invalid target level (must be 1 or 2)' }, { status: 400 })
        }
        if (!fullName || fullName.length < 3) {
            return NextResponse.json({ error: 'Full name is required (min 3 chars)' }, { status: 400 })
        }
        if (!isValidPhone(phone)) {
            return NextResponse.json({ error: 'Invalid phone number (must start with +62 or 08)' }, { status: 400 })
        }
        if (!isValidEmail(email)) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
        }
        if (!isValidFile(selfie)) {
            return NextResponse.json({ error: 'Selfie photo required (JPG/PNG/PDF, max 5MB)' }, { status: 400 })
        }

        // ── Level 2 extra validations
        if (targetLevel === 2) {
            const nik = (form.get('nik') as string)?.trim()
            const dob = (form.get('dob') as string)?.trim()
            const address_ = (form.get('address') as string)?.trim()
            const ktpPhoto = form.get('ktpPhoto') as File | null
            const selfieWithId = form.get('selfieWithId') as File | null

            if (!isValidNIK(nik)) {
                return NextResponse.json({ error: 'NIK must be exactly 16 digits' }, { status: 400 })
            }
            if (!dob || !isAdult(dob)) {
                return NextResponse.json({ error: 'Must be at least 18 years old' }, { status: 400 })
            }
            if (!address_ || address_.length < 20) {
                return NextResponse.json({ error: 'Full address required (min 20 chars)' }, { status: 400 })
            }
            if (!isValidFile(ktpPhoto)) {
                return NextResponse.json({ error: 'KTP photo required (JPG/PNG/PDF, max 5MB)' }, { status: 400 })
            }
            if (!isValidFile(selfieWithId)) {
                return NextResponse.json({ error: 'Selfie with ID required (JPG/PNG/PDF, max 5MB)' }, { status: 400 })
            }
        }

        // ── Check env vars
        if (!REGISTRY_ADDRESS || !ADMIN_RPC || !process.env.ADMIN_PRIVATE_KEY) {
            console.error('KYC API: missing env vars')
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
        }

        // ── Call setKycLevel on-chain
        const account = privateKeyToAccount(process.env.ADMIN_PRIVATE_KEY as `0x${string}`)

        const walletClient = createWalletClient({
            account,
            transport: http(ADMIN_RPC),
            chain: tenderlyVTN,
        })

        const publicClient = createPublicClient({
            transport: http(ADMIN_RPC),
            chain: tenderlyVTN,
        })

        const txHash = await walletClient.writeContract({
            address: REGISTRY_ADDRESS,
            abi: REGISTRY_ABI,
            functionName: 'setKycLevel',
            args: [walletAddress as `0x${string}`, targetLevel],
        })

        // Wait for confirmation
        await publicClient.waitForTransactionReceipt({ hash: txHash })

        // Verify on-chain
        const newLevel = await publicClient.readContract({
            address: REGISTRY_ADDRESS,
            abi: REGISTRY_ABI,
            functionName: 'getKycLevel',
            args: [walletAddress as `0x${string}`],
        })

        console.log(`KYC: ${walletAddress} upgraded to Level ${newLevel}. TX: ${txHash}`)

        return NextResponse.json({
            success: true,
            txHash,
            newLevel: Number(newLevel),
            message: `KYC Level ${newLevel} activated`,
        })

    } catch (error: any) {
        console.error('KYC submit error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to process KYC submission' },
            { status: 500 }
        )
    }
}
