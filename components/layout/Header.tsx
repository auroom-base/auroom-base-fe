'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import { WalletButton } from '@/components/shared/WalletButton';

export function Header() {
    const { isConnected } = useAccount();

    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl supports-[backdrop-filter]:bg-black/100">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <Image
                            src="/logo.svg"
                            alt="AuRoom Logo"
                            width={32}
                            height={32}
                            className="group-hover:scale-110 transition-transform"
                        />
                        <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 bg-clip-text text-transparent">
                            AuRoom
                        </span>
                    </Link>

                    {/* Navigation - Only show when wallet is connected */}
                    {isConnected && (
                        <nav className="hidden md:flex items-center space-x-6">
                            <Link
                                href="/faucet"
                                className="text-sm font-medium text-white/80 hover:text-yellow-400 transition-colors"
                            >
                                Faucet
                            </Link>
                            <Link
                                href="/cash-loan"
                                className="text-sm font-medium text-white/80 hover:text-yellow-400 transition-colors"
                            >
                                Cash Loan
                            </Link>
                            <Link
                                href="/my-loans"
                                className="text-sm font-medium text-white/80 hover:text-yellow-400 transition-colors"
                            >
                                My Loans
                            </Link>
                        </nav>
                    )}

                    {/* Wallet Button */}
                    <WalletButton />
                </div>
            </div>
        </header>
    );
}
