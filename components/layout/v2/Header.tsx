'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import { WalletButton } from '@/components/shared/WalletButton';
import { useState } from 'react';
import { LiquidGlassCard } from '@/components/ui/liquid-glass';
import { ArrowUpDown, BarChart2, Bell, Home, Menu, Search, Settings, X } from 'lucide-react';

export function Header() {
    const { isConnected } = useAccount();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            <header className="sticky top-5 z-50 mx-5">
                <LiquidGlassCard
                    shadowIntensity='sm'
                    glowIntensity='xs'
                    blurIntensity='sm'
                    borderRadius='100px'
                    className='px-6 py-1 md:py-2 md:px-8 text-white bg-white/8'
                >
                    <div className="flex h-16 items-center justify-between relative z-30">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2 group">
                            <Image
                                src="/logo.svg"
                                alt="AuRoom Logo"
                                width={20}
                                height={20}
                                className="block md:hidden group-hover:scale-110 transition-transform"
                            />
                            <Image
                                src="/logo.svg"
                                alt="AuRoom Logo"
                                width={24}
                                height={24}
                                className="hidden md:block group-hover:scale-110 transition-transform"
                            />
                            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 bg-clip-text text-transparent">
                                AuRoom
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        {isConnected && (<nav className="hidden md:flex items-center space-x-6">
                            <Link
                                href="/swap"
                                className="text-base font-medium text-white/80 hover:text-yellow-400 transition-colors flex items-center gap-1"
                            >
                                {/* <ArrowUpDown className="w-4 h-4" /> */}
                                Swap
                            </Link>
                            <Link
                                href="/cash-loan"
                                className="text-base font-medium text-yellow-400 hover:text-yellow-300 transition-colors flex items-center gap-1"
                            >
                                Cash Loan
                            </Link>
                            <Link
                                href="/my-loans"
                                className="text-sm font-medium text-white/80 hover:text-yellow-400 transition-colors"
                            >
                                My Loans
                            </Link>
                            <Link
                                href="/verify"
                                className="text-base font-medium text-white/80 hover:text-yellow-400 transition-colors"
                            >
                                Verify
                            </Link>
                        </nav>)}

                        {/* Desktop Wallet Button */}
                        <div className="hidden md:block">
                            <WalletButton />
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMobileMenu}
                            className="md:hidden p-2 rounded-xl bg-white/10 transition-all duration-300 border border-white/20"
                            aria-label="Toggle menu"
                        >
                            <div className="relative w-5 h-5">
                                <Menu
                                    className={`w-5 h-5 text-yellow-400 absolute transition-all duration-300 ${isMobileMenuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
                                        }`}
                                />
                                <X
                                    className={`w-5 h-5 text-yellow-400 absolute transition-all duration-300 ${isMobileMenuOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
                                        }`}
                                />
                            </div>
                        </button>
                    </div>
                </LiquidGlassCard>
            </header>

            {/* Mobile Menu - Full Screen Overlay */}
            <div
                className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ease-in-out ${isMobileMenuOpen
                    ? 'opacity-100 pointer-events-auto'
                    : 'opacity-0 pointer-events-none'
                    }`}
            >
                <LiquidGlassCard
                    shadowIntensity='sm'
                    glowIntensity='xs'
                    blurIntensity='md'
                    borderRadius='24px'
                    className={`p-4 text-white bg-white/8
                        absolute top-32 left-6 right-6 transition-all duration-500 ease-out ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
                        }`}
                >
                    <div className="overflow-hidden relative z-30">
                        {/* Menu Items Container */}
                        <nav className="p-2 space-y-2">
                            {/* Mobile Menu Items */}
                            {isConnected && (<>
                                <Link
                                    href="/swap"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block text-center py-6 text-xl font-bold text-white transition-all duration-300"
                                >
                                    <span>
                                        Swap
                                    </span>
                                </Link>

                                <Link
                                    href="/cash-loan"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block text-center py-6 text-xl font-bold text-white transition-all duration-300"
                                >
                                    Cash Loan
                                </Link>

                                <Link
                                    href="/my-loans"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block text-center py-6 text-xl font-bold text-white transition-all duration-300"
                                >
                                    My Loans
                                </Link>

                                <Link
                                    href="/verify"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block text-center py-6 text-xl font-bold text-white transition-all duration-300"
                                >
                                    Verify
                                </Link>
                            </>)}

                            <div className="pt-4">
                                <WalletButton />
                            </div>
                        </nav>
                    </div>
                </LiquidGlassCard>

                {/* Menu Content - Glassmorphism Card */}

            </div>
        </>
    );
}
