'use client';

import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, UserCheck, Code2, TrendingUp, Wallet, Coins, ArrowUpRight } from 'lucide-react';
import { useLandingStats } from '@/hooks/useLandingStats';

gsap.registerPlugin(ScrollTrigger);

const securityFeatures = [
    {
        icon: <ShieldCheck className="w-8 h-8 text-[#F5A623]" />,
        title: 'Blockchain Secured',
        description: 'Your digital gold is secured by immutable smart contracts on the blockchain, eliminating centralized points of failure.',
    },
    {
        icon: <UserCheck className="w-8 h-8 text-[#F5A623]" />,
        title: 'Verified Identity',
        description: 'Institutional-grade KYC ensures a compliant and secure ecosystem for all participants.',
    },
    {
        icon: <Code2 className="w-8 h-8 text-[#F5A623]" />,
        title: 'Transparent Code',
        description: 'Our smart contracts are open-source and verified, allowing anyone to audit the logic securing their assets.',
    },
];

const techPartners = [
    {
        name: 'Mantle Network',
        description: 'Powered by Mantle Chain',
        // role: 'L2 Infrastructure',
        image: 'data:image/png;base64,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', // Abstract blue tech
    },
    {
        name: 'IDRX',
        description: 'Indonesian Rupiah Stablecoin',
        // role: 'Liquidity Partner',
        image: 'data:image/jpeg;base64,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'
    },
    {
        name: 'Tether Gold',
        description: 'XAUT Stablecoin',
        // role: 'Gold Backing',
        image: 'data:image/jpeg;base64,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', // Gold texture
    },
];

export function TrustSection() {
    const stats = useLandingStats();
    const containerRef = useRef<HTMLElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    const featuresRef = useRef<HTMLDivElement>(null);
    const partnersRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Stats Animation
        const statCards = Array.from(statsRef.current?.children || []);
        gsap.fromTo(statCards,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: statsRef.current,
                    start: 'top 80%',
                }
            }
        );

        // Features Animation
        const featureCards = Array.from(featuresRef.current?.children || []);
        gsap.fromTo(featureCards,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: featuresRef.current,
                    start: 'top 75%',
                }
            }
        );

        // Partners Animation
        const partnerCards = Array.from(partnersRef.current?.children || []);
        gsap.fromTo(partnerCards,
            { scale: 0.9, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 0.6,
                stagger: 0.15,
                ease: 'back.out(1.7)',
                scrollTrigger: {
                    trigger: partnersRef.current,
                    start: 'top 80%',
                }
            }
        );
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="py-24 bg-black relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-[#F5A623]/5 rounded-full blur-[128px]" />
                <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-[#F5A623]/5 rounded-full blur-[128px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                {/* Live Stats Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5A623]/10 border border-[#F5A623]/20 text-[#F5A623] text-sm font-medium mb-6">
                        <TrendingUp className="w-4 h-4" />
                        Live Protocol Data
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Transparent & <span className="text-[#F5A623]">Verifiable</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Real-time data directly from the blockchain. We believe in complete transparency for your peace of mind.
                    </p>
                </div>

                {/* Live Stats Cards */}
                <div ref={statsRef} className="grid md:grid-cols-3 gap-6 mb-32">
                    {/* Total Loans */}
                    <div className="group relative bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-[#F5A623]/50 transition-all duration-300">
                        <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity duration-300">
                            <TrendingUp className="w-12 h-12 text-[#F5A623]" />
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="p-2 bg-[#F5A623]/10 rounded-lg text-[#F5A623]">
                                <Wallet className="w-5 h-5" />
                            </span>
                            <span className="text-gray-400 font-medium">Loans Disbursed</span>
                        </div>
                        <div className="text-4xl font-bold text-white mb-1">
                            {stats.totalLoans}
                        </div>
                        <div className="text-sm text-gray-500">Active borrower contracts</div>
                    </div>

                    {/* Gold Collateral */}
                    <div className="group relative bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-[#F5A623]/50 transition-all duration-300">
                        <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity duration-300">
                            <Coins className="w-12 h-12 text-[#F5A623]" />
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="p-2 bg-[#F5A623]/10 rounded-lg text-[#F5A623]">
                                <ArrowUpRight className="w-5 h-5" />
                            </span>
                            <span className="text-gray-400 font-medium">Gold Secured</span>
                        </div>
                        <div className="text-4xl font-bold text-white mb-1">
                            {stats.totalCollateral} <span className="text-lg text-[#F5A623]">XAUT</span>
                        </div>
                        <div className="text-sm text-gray-500">≈ {stats.totalCollateralIDR}</div>
                    </div>

                    {/* Gold Price */}
                    <div className="group relative bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-[#F5A623]/50 transition-all duration-300">
                        <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity duration-300">
                            <ArrowUpRight className="w-12 h-12 text-[#F5A623]" />
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="p-2 bg-[#F5A623]/10 rounded-lg text-[#F5A623]">
                                <TrendingUp className="w-5 h-5" />
                            </span>
                            <span className="text-gray-400 font-medium">Live Gold Price</span>
                        </div>
                        <div className="text-4xl font-bold text-white mb-1">
                            {stats.xautPriceIdrx}
                        </div>
                        <div className="text-sm text-gray-500">IDR per 1 XAUT (1 oz)</div>
                    </div>
                </div>

                {/* Divider Line */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-32" />

                {/* Security Section */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Institutional-Grade <span className="text-[#F5A623]">Security</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Built on the Mantle Network, leveraging the same security standards as major financial institutions.
                    </p>
                </div>

                <div ref={featuresRef} className="grid md:grid-cols-3 gap-8 mb-32">
                    {securityFeatures.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-black border border-zinc-800 rounded-2xl p-8 text-center hover:border-[#F5A623]/50 hover:bg-[#F5A623]/5 transition-all duration-500 group"
                        >
                            <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border border-zinc-800 group-hover:border-[#F5A623]/30">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4 group-hover:text-[#F5A623] transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Partners Section */}
                <div className="text-center mb-16">
                    <p className="text-[#F5A623] font-medium tracking-wider uppercase mb-8">Trusted Ecosystem Partners</p>
                    <div ref={partnersRef} className="flex flex-wrap justify-center gap-6 md:gap-12">
                        {techPartners.map((partner, index) => (
                            <div
                                key={index}
                                className="group relative w-full md:w-auto min-w-[280px]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[#F5A623]/0 via-[#F5A623]/10 to-[#F5A623]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4 hover:border-[#F5A623]/50 transition-all duration-300">
                                    <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden rounded-full border border-white/10">
                                        <Image
                                            src={partner.image}
                                            alt={partner.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="text-white font-bold">{partner.name}</h4>
                                        {/* <p className="text-xs text-gray-500">{partner.role}</p> */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
