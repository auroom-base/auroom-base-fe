'use client';

import { useRef } from 'react';
import { Zap, BadgePercent, ShieldCheck, Globe, Smartphone, RefreshCw, Check } from 'lucide-react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const benefits = [
    {
        icon: <Zap className="w-6 h-6 text-[#F5A623]" />,
        title: 'Lightning Fast',
        description: 'Instant liquidity. Get stablecoins in your wallet minutes after depositing your gold.',
        image: 'https://images.unsplash.com/photo-1657408056887-c8c627f7574a?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Speed/Tech
    },
    {
        icon: <BadgePercent className="w-6 h-6 text-[#F5A623]" />,
        title: 'Zero Hidden Fees',
        description: 'Transparent 0.5% flat fee. No compound interest, no administration charges.',
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2672&auto=format&fit=crop', // Finance/Growth
    },
    {
        icon: <ShieldCheck className="w-6 h-6 text-[#F5A623]" />,
        title: 'Bank-Grade Security',
        description: 'Your physical gold is insured and stored in regulated vaults. Smart contracts are audited.',
        image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2670&auto=format&fit=crop', // Security
    },
    {
        icon: <Globe className="w-6 h-6 text-[#F5A623]" />,
        title: '24/7 Access',
        description: 'Your assets never sleep. Borrow or repay anytime, from anywhere in the world.',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop', // Connectivity
    },
    {
        icon: <Smartphone className="w-6 h-6 text-[#F5A623]" />,
        title: 'Fully Digital',
        description: 'No paperwork, no office visits. Manage your loans entirely from your dashboard.',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2670&auto=format&fit=crop', // Digital
    },
    {
        icon: <RefreshCw className="w-6 h-6 text-[#F5A623]" />,
        title: 'Flexible Repayment',
        description: 'You set the schedule. Repay partially or fully whenever you want without penalties.',
        image: 'https://images.unsplash.com/photo-1638202947561-e372255007b3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHNjaGVkdWxlJTIwY2xvY2t8ZW58MHx8MHx8fDI%3D', // Flow
    },
];

const comparisonData = [
    { feature: 'Processing Time', auroom: '< 5 minutes', traditional: '24-48 Hours' },
    { feature: 'Fee Structure', auroom: '0.5% Flat Fee', traditional: 'High Monthly Interest' },
    { feature: 'Accessibility', auroom: '24/7 Global', traditional: 'Business Hours Only' },
    { feature: 'Requirements', auroom: 'No Credit Check', traditional: 'Payslips & Credit Score' },
    { feature: 'Asset Control', auroom: 'Repay Anytime', traditional: 'Fixed Terms' },
];

export function BenefitsSection() {
    const containerRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);
    const tableRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 80%',
                toggleActions: 'play none none reset',
            }
        });

        // Header Animation
        tl.fromTo(headerRef.current,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
        );

        // Cards Stagger
        if (cardsRef.current) {
            const cards = Array.from(cardsRef.current.children);
            gsap.fromTo(cards,
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: cardsRef.current,
                        start: 'top 75%',
                        toggleActions: 'play none none reset',
                    }
                }
            );
        }

        // Table Animation
        if (tableRef.current) {
            gsap.fromTo(tableRef.current,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: tableRef.current,
                        start: 'top 80%',
                        toggleActions: 'play none none reset',
                    }
                }
            );

            // Table rows stagger
            const rows = Array.from(tableRef.current.querySelectorAll('.comparison-row'));
            gsap.fromTo(rows,
                { x: -20, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.4,
                    stagger: 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: tableRef.current,
                        start: 'top 70%',
                        toggleActions: 'play none none reset',
                    }
                }
            );
        }

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="py-24 md:py-32 bg-black relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-0 top-1/3 w-[500px] h-[500px] bg-[#F5A623]/5 rounded-full blur-[128px]" />
                <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-[#F5A623]/5 rounded-full blur-[128px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                {/* Section Header */}
                <div ref={headerRef} className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#F5A623] text-sm font-medium mb-6">
                        <Zap className="w-4 h-4" />
                        Why Choose AuRoom
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        The Future of <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5A623] to-amber-200">
                            Gold Lending
                        </span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Experience a protocol designed for the speed of modern finance, backed by the timeless security of gold.
                    </p>
                </div>

                {/* Benefits Grid */}
                <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="group relative h-full bg-zinc-900/40 border border-white/5 rounded-2xl overflow-hidden hover:border-[#F5A623]/30 transition-all duration-500 hover:-translate-y-2"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10" />

                            {/* Image Background */}
                            <div className="absolute inset-0">
                                <Image
                                    src={benefit.image}
                                    alt={benefit.title}
                                    fill
                                    className="object-cover opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-700 grayscale group-hover:grayscale-0"
                                />
                            </div>

                            <div className="relative z-20 p-8 h-full flex flex-col">
                                <div className="w-12 h-12 rounded-xl bg-[#F5A623]/10 flex items-center justify-center border border-[#F5A623]/20 mb-6 group-hover:bg-[#F5A623] group-hover:text-black transition-all duration-300">
                                    {/* Clone icon to change color on hover if needed, or rely on text color inherit */}
                                    <div className="group-hover:text-black transition-colors">
                                        {benefit.icon}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#F5A623] transition-colors">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                                    {benefit.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Comparison Table Section */}
                <div ref={tableRef} className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                            AuRoom vs. Traditional Ways
                        </h3>
                        <p className="text-gray-400">See clearly why smart investors are switching.</p>
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                        {/* Table Header */}
                        <div className="grid grid-cols-[1.5fr_1fr_1fr] p-6 border-b border-white/10 bg-white/5">
                            <div className="text-gray-400 font-medium text-base uppercase tracking-wider">Features</div>
                            <div className="text-[#F5A623] font-bold text-center text-base flex items-center justify-center gap-2">
                                <span>AUROOM</span>
                            </div>
                            <div className="text-gray-500 font-medium text-center text-base uppercase tracking-wider">
                                Traditional
                            </div>
                        </div>

                        {/* Table Rows */}
                        <div className="divide-y divide-white/5">
                            {comparisonData.map((row, index) => (
                                <div
                                    key={index}
                                    className="comparison-row grid grid-cols-[1.5fr_1fr_1fr] p-6 hover:bg-white/5 transition-colors items-center group"
                                >
                                    <div className="text-white font-medium text-base pr-4 group-hover:text-[#F5A623] transition-colors">
                                        {row.feature}
                                    </div>
                                    <div className="flex justify-center">
                                        <div className="min-w-[140px] text-center text-sm font-bold text-white bg-[#F5A623]/10 py-2 px-4 rounded-full border border-[#F5A623]/20 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,166,35,0.1)]">
                                            <Check className="w-4 h-4 text-[#F5A623]" />
                                            <span>{row.auroom}</span>
                                        </div>
                                    </div>
                                    <div className="text-center text-gray-500 font-medium opacity-60 decoration-white/20">
                                        <span className="line-through">{row.traditional}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {comparisonData.map((row, index) => (
                            <div
                                key={index}
                                className="comparison-row bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-xl p-5"
                            >
                                <h4 className="text-white font-bold text-lg mb-4 text-center">{row.feature}</h4>

                                <div className="space-y-3">
                                    {/* AuRoom Row */}
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#F5A623]/10 border border-[#F5A623]/20">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-[#F5A623] rounded-full p-0.5">
                                                <Check className="w-3 h-3 text-black" />
                                            </div>
                                            <span className="text-[#F5A623] font-bold text-sm">AuRoom</span>
                                        </div>
                                        <span className="text-white font-semibold text-sm">{row.auroom}</span>
                                    </div>

                                    {/* Traditional Row */}
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-gray-700 rounded-full w-4 h-4 flex items-center justify-center text-[10px] text-gray-400">
                                                ✕
                                            </div>
                                            <span className="text-gray-400 font-medium text-sm">Traditional</span>
                                        </div>
                                        <span className="text-gray-500 text-sm line-through decoration-gray-600">{row.traditional}</span>
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
