'use client';

import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useIdentityRegistry } from '@/hooks/contracts/useIdentityRegistry';
import { useState, useRef } from 'react';
import { isValidAddress } from '@/lib/utils/validation';
import type { Address } from 'viem';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function VerifyPage() {
    const { address, isConnected } = useAccount();
    const [addressToRegister, setAddressToRegister] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const { useIsVerified, registerIdentity, isPending, isConfirming, isSuccess, error } = useIdentityRegistry();
    const { data: isVerified, isLoading } = useIsVerified(address);

    useGSAP(() => {
        const tl = gsap.timeline();

        tl.from('.hero-section', {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        })
            .from('.status-card', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out',
                stagger: 0.2
            }, '-=0.5');

    }, { scope: containerRef });

    const handleRegister = () => {
        if (isValidAddress(addressToRegister)) {
            registerIdentity(addressToRegister as Address);
        }
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-black py-16 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto space-y-12">
                    {/* Hero Section */}
                    <div className="hero-section text-center space-y-6">
                        <div className="relative w-32 h-32 mx-auto mb-6">
                            {/* Abstract Security Illustration */}
                            <img
                                src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=400"
                                alt="Security Shield"
                                className="w-full h-full object-cover rounded-2xl shadow-2xl shadow-yellow-500/20 rotate-3 hover:rotate-0 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl" />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                            Identity <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">Verification</span>
                        </h1>
                        <p className="text-lg text-white/60 max-w-lg mx-auto leading-relaxed">
                            Complete your KYC verification to unlock the full potential of the AuRoom protocol. Secure, fast, and reliable.
                        </p>
                    </div>

                    {/* Verification Status Card */}
                    <div className="status-card relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-b from-yellow-500/20 to-transparent rounded-3xl blur opacity-50 group-hover:opacity-75 transition-opacity" />
                        <div className="relative p-8 rounded-3xl bg-zinc-900/80 backdrop-blur-xl border border-white/10">

                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                                <div className="text-center md:text-left">
                                    <h2 className="text-2xl font-bold text-white mb-2">Account Status</h2>
                                    <p className="text-white/60">Current verification level</p>
                                </div>

                                {!isConnected ? (
                                    <Badge variant="outline" className="px-4 py-2 border-white/10 bg-white/5 text-white">
                                        Wallet Not Connected
                                    </Badge>
                                ) : isLoading ? (
                                    <Badge variant="outline" className="px-4 py-2 border-yellow-500/30 bg-yellow-500/10 text-yellow-400 animate-pulse">
                                        Checking Status...
                                    </Badge>
                                ) : (
                                    <div className={`px-6 py-3 rounded-xl border flex items-center gap-3 ${isVerified
                                            ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                            : 'bg-red-500/10 border-red-500/20 text-red-400'
                                        }`}>
                                        {isVerified ? (
                                            <>
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                <span className="font-semibold">Verified & Secure</span>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                                <span className="font-semibold">Action Required</span>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {isConnected && (
                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                                        <div className="text-sm text-white/40">Connected Address</div>
                                        <div className="font-mono text-white/80 text-sm truncate max-w-[200px] md:max-w-none">
                                            {address}
                                        </div>
                                    </div>

                                    {!isVerified && (
                                        <div className="p-6 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/10">
                                            <div className="flex gap-4">
                                                <div className="flex-1">
                                                    <h3 className="text-yellow-400 font-semibold mb-2">Verification Needed</h3>
                                                    <p className="text-white/60 text-sm leading-relaxed">
                                                        Your address requires verification to access borrowing features. Please contact our support team or the protocol administrator to initiate the KYC process.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {isVerified && (
                                        <div className="p-6 rounded-2xl bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/10">
                                            <div className="flex gap-4">
                                                <div className="flex-1">
                                                    <h3 className="text-green-400 font-semibold mb-2">You're All Set!</h3>
                                                    <p className="text-white/60 text-sm leading-relaxed">
                                                        Your identity has been verified. You now have unrestricted access to collateralize assets and request loans.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Admin Panel (Conditional) */}
                    {isConnected && (
                        <div className="status-card border-t border-white/10 pt-12">
                            <div className="max-w-xl mx-auto">
                                <div className="text-center mb-6">
                                    <h3 className="text-lg font-semibold text-white/80">Admin Controls</h3>
                                    <p className="text-sm text-white/40">Restricted to protocol administrators</p>
                                </div>

                                <div className="p-6 rounded-3xl bg-zinc-900 border border-white/5 space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-white/60 uppercase tracking-wider pl-1">Register Address</label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="text"
                                                placeholder="0x..."
                                                value={addressToRegister}
                                                onChange={(e) => setAddressToRegister(e.target.value)}
                                                className="bg-black/50 border-white/10 text-white placeholder:text-white/20 h-12"
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full h-12 bg-white text-black hover:bg-gray-200 font-bold text-sm"
                                        onClick={handleRegister}
                                        disabled={
                                            !addressToRegister ||
                                            !isValidAddress(addressToRegister) ||
                                            isPending ||
                                            isConfirming
                                        }
                                    >
                                        {isPending || isConfirming ? 'Processing Transaction...' : 'Register Identity'}
                                    </Button>

                                    {isSuccess && (
                                        <div className="text-center text-sm text-green-400 pt-2">
                                            Successfully registered address
                                        </div>
                                    )}

                                    {error && (
                                        <div className="text-center text-sm text-red-400 pt-2 bg-red-500/10 p-2 rounded">
                                            {error.message}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
