import type { Metadata } from 'next'
import { FaucetCard } from '@/components/faucet/FaucetCard'

export const metadata: Metadata = {
    title: 'XAUT Faucet | AuRoom',
    description: 'Get testnet XAUT to try gold-backed borrowing on AuRoom',
}

export default function FaucetPage() {
    return (
        <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-md">
                <FaucetCard />
            </div>
        </main>
    )
}
