'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccount } from 'wagmi';
import { Home, ArrowLeftRight, Banknote, FileText, Droplets, ShieldCheck } from 'lucide-react';

const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/cash-loan', label: 'Loan', icon: Banknote, requiresAuth: true },
    { href: '/faucet', label: 'Faucet', icon: Droplets, requiresAuth: true },
    { href: '/kyc', label: 'KYC', icon: ShieldCheck, requiresAuth: true },
    { href: '/my-loans', label: 'My Loans', icon: FileText, requiresAuth: true },
];

export function BottomNavigation() {
    const pathname = usePathname();
    const { isConnected } = useAccount();

    // Filter items based on auth status
    const visibleItems = navItems.filter(item => !item.requiresAuth || isConnected);

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/95 backdrop-blur-xl md:hidden">
            <div className="flex items-center justify-around h-16 px-2">
                {visibleItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] px-3 py-2 rounded-lg transition-colors ${isActive
                                ? 'text-yellow-400 bg-yellow-400/10'
                                : 'text-white/60 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Icon className="w-5 h-5 mb-1" />
                            <span className="text-xs font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
            {/* Safe area padding for iOS */}
            <div className="h-safe-area-inset-bottom bg-black" />
        </nav>
    );
}
