'use client';

import { useRef } from 'react';
import { Clock, Ban, FileWarning, Zap, Percent, ShieldCheck, RefreshCw, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const problems = [
    {
        image: 'https://images.unsplash.com/photo-1591439657848-9f4b9ce436b9?q=80&w=2574&auto=format&fit=crop', // Queue/Waiting
        title: 'Stuck in the Past?',
        subtitle: 'Traditional Pawnshops',
        points: ['Endless queues', 'Mountains of paperwork', 'Strict operating hours'],
        icon: <Clock className="w-5 h-5 text-[#F5A623]" />
    },
    {
        image: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?q=80&w=2671&auto=format&fit=crop', // Money loss concept
        title: 'Selling is Losing',
        subtitle: 'Traditional Gold Selling',
        points: ['Lose your asset forever', 'Huge spread loss', 'Regret comes later'],
        icon: <Ban className="w-5 h-5 text-[#F5A623]" />
    },
    {
        image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2670&auto=format&fit=crop', // Paperwork
        title: 'Buried in Paperwork?',
        subtitle: 'Bank Loans',
        points: ['Days to approve', 'Complex requirements', 'Rigid terms'],
        icon: <FileWarning className="w-5 h-5 text-[#F5A623]" />
    },
];

export function ProblemSolutionSection() {
    const containerRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);
    const solutionRef = useRef<HTMLDivElement>(null);
    const laserRef = useRef<HTMLDivElement>(null);

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

        // Cards Animation
        if (cardsRef.current) {
            const cards = Array.from(cardsRef.current.children);
            gsap.fromTo(cards,
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: cardsRef.current,
                        start: 'top 75%',
                        toggleActions: 'play none none reset',
                    }
                }
            );
        }

        // Continuous rotation for laser
        gsap.to(laserRef.current, {
            rotation: 360,
            duration: 4,
            repeat: -1,
            ease: 'linear'
        });

        // Solution Section Animation
        const solutionTl = gsap.timeline({
            scrollTrigger: {
                trigger: solutionRef.current,
                start: 'top 70%',
                toggleActions: 'play none none reset',
            }
        });

        solutionTl.fromTo(solutionRef.current,
            { scale: 0.9, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 1,
                ease: 'power2.out',
            }
        ).to(laserRef.current, {
            opacity: 1,
            duration: 1
        }, "-=0.5");

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="py-24 bg-black relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-64 w-96 h-96 bg-[#F5A623]/5 rounded-full blur-[128px]" />
                <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-[#F5A623]/5 rounded-full blur-[128px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                {/* Problem Section */}
                <div ref={headerRef} className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        Why the Old Way <span className="text-[#F5A623]">Doesn't Work</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Traditional financial systems weren't built for the speed of the digital age.
                    </p>
                </div>

                {/* Problem Cards */}
                <div ref={cardsRef} className="grid md:grid-cols-3 gap-8 mb-32">
                    {problems.map((problem, index) => (
                        <div
                            key={index}
                            className="group relative bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:border-[#F5A623]/30 transition-all duration-500"
                        >
                            {/* Image Cap */}
                            <div className="h-48 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent z-10" />
                                <Image
                                    src={problem.image}
                                    alt={problem.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out grayscale group-hover:grayscale-0"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-8 relative z-20 -mt-12">
                                <div className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 p-4 rounded-xl mb-6 shadow-xl">
                                    <div className="flex items-center gap-3 mb-1">
                                        {problem.icon}
                                        <span className="text-[#F5A623] font-medium text-sm tracking-uppercase uppercase tracking-wider">
                                            {problem.subtitle}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">
                                        {problem.title}
                                    </h3>
                                </div>

                                <ul className="space-y-3">
                                    {problem.points.map((point, idx) => (
                                        <li key={idx} className="text-gray-400 text-sm flex items-start gap-3 group-hover:text-gray-300 transition-colors">
                                            <span className="text-[#F5A623]/50 mt-0.5">•</span>
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Solution Section */}
                <div id="solution" className="relative">
                    {/* Glowing Divider */}
                    <div className="absolute left-1/2 -top-16 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-[#F5A623] to-transparent" />

                    <div ref={solutionRef} className="bg-gradient-to-b from-zinc-900/80 to-black border border-[#F5A623]/20 rounded-3xl p-8 md:p-12 overflow-hidden relative">
                        {/* Laser Border Effect */}
                        <div
                            className="absolute inset-0 rounded-3xl pointer-events-none z-10"
                            style={{
                                padding: '2px',
                                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                maskComposite: 'exclude',
                                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                WebkitMaskComposite: 'xor',
                            }}
                        >
                            <div
                                ref={laserRef}
                                className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] opacity-0"
                                style={{
                                    background: 'conic-gradient(from 0deg, transparent 0deg, transparent 200deg, #F5A623 360deg)',
                                }}
                            />
                        </div>

                        {/* Glow Effect */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-[#F5A623] shadow-[0_0_100px_rgba(245,166,35,0.5)]" />

                        <div className="grid lg:grid-cols-2 gap-12 items-center relative z-20">
                            <div className="text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5A623]/10 border border-[#F5A623]/20 text-[#F5A623] text-sm font-medium mb-6">
                                    <Zap className="w-4 h-4" />
                                    The New Standard
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                    The Smart Way: <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5A623] to-amber-200">
                                        AuRoom Cash Loans
                                    </span>
                                </h2>
                                <p className="text-gray-400 text-lg leading-relaxed mb-8">
                                    Instant liquidity without selling your assets. We've reimagined the pawn experience for the digital age—transparent, fast, and completely secure.
                                </p>
                                <button className="group bg-[#F5A623] text-black font-bold px-8 py-4 rounded-xl hover:bg-[#F5A623]/90 hover:scale-105 transition-all duration-300 flex items-center gap-2">
                                    Get Cash Now
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                {[
                                    {
                                        icon: <Zap className="w-6 h-6" />,
                                        title: 'Instant Process',
                                        desc: 'Cash in your account in < 5 mins'
                                    },
                                    {
                                        icon: <Percent className="w-6 h-6" />,
                                        title: '0.5% Fee',
                                        desc: 'Lowest rates in the market'
                                    },
                                    {
                                        icon: <ShieldCheck className="w-6 h-6" />,
                                        title: 'Secure',
                                        desc: 'Audited smart contracts'
                                    },
                                    {
                                        icon: <RefreshCw className="w-6 h-6" />,
                                        title: 'Flexible Repay',
                                        desc: 'Pay back on your terms'
                                    },
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className="bg-black/40 border border-white/5 p-6 rounded-2xl hover:bg-white/5 transition-colors hover:-translate-y-1 transform duration-300"
                                    >
                                        <div className="bg-[#F5A623]/10 w-12 h-12 rounded-lg flex items-center justify-center text-[#F5A623] mb-4">
                                            {item.icon}
                                        </div>
                                        <h3 className="text-white font-bold mb-1">{item.title}</h3>
                                        <p className="text-gray-500 text-sm">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
