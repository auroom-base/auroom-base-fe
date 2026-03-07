// app/api/simulate/repay/route.ts
// POST /api/simulate/repay { from, repayAmount, withdrawAmount }
// Uses Tenderly REST Simulation API against real Base Sepolia (network_id: 84532).

import { NextRequest, NextResponse } from 'next/server'
import { encodeFunctionData, parseAbi } from 'viem'

const TENDERLY_KEY = process.env.TENDERLY_ACCESS_KEY ?? ''
const TENDERLY_ACCOUNT = process.env.TENDERLY_ACCOUNT ?? ''
const TENDERLY_PROJECT = process.env.TENDERLY_PROJECT ?? ''
const TENDERLY_URL = `https://api.tenderly.co/api/v1/account/${TENDERLY_ACCOUNT}/project/${TENDERLY_PROJECT}/simulate`

const CONTRACT = '0x4a5a4284c7f4170b00e90bba42df8dcc3b0cc036'

const ABI = parseAbi([
    'function repayAndWithdraw(uint256 repayAmount, uint256 withdrawAmount) external',
])

export async function POST(req: NextRequest) {
    try {
        const { from, repayAmount, withdrawAmount } = await req.json()
        if (!from || !repayAmount) {
            return NextResponse.json({ error: 'Missing params' }, { status: 400 })
        }

        const input = encodeFunctionData({
            abi: ABI,
            functionName: 'repayAndWithdraw',
            args: [BigInt(repayAmount), BigInt(withdrawAmount ?? 0)],
        })

        const res = await fetch(TENDERLY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Key': TENDERLY_KEY,
            },
            body: JSON.stringify({
                network_id: '84532',   // Base Sepolia
                from,
                to: CONTRACT,
                input,
                gas: 500000,
                gas_price: '0',
                value: '0',
                save: true,
                save_if_fails: true,
            }),
        })

        if (!res.ok) {
            const errText = await res.text()
            throw new Error(`Tenderly API error ${res.status}: ${errText}`)
        }

        const data = await res.json()
        const tx = data.transaction

        if (!tx?.status) {
            const reason =
                tx?.error_info?.error_message ??
                tx?.transaction_info?.call_trace?.error ??
                'Transaction would revert'
            return NextResponse.json({ success: false, gasUsed: 0, revertReason: reason })
        }

        return NextResponse.json({
            success: true,
            gasUsed: tx.gas_used ?? 0,
            revertReason: null,
            simulationId: data.simulation?.id,
        })

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
