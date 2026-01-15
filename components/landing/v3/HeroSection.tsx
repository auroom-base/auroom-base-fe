'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
    const router = useRouter();
    const { isConnected } = useAccount();
    const { openConnectModal } = useConnectModal();
    const containerRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);

    const handleBorrowNow = () => {
        if (isConnected) {
            router.push('/cash-loan');
        } else {
            openConnectModal?.();
        }
    };

    useGSAP(() => {
        const tl = gsap.timeline();

        // Initial entry animation
        tl.fromTo(textRef.current?.children || [],
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.2,
                ease: 'power3.out'
            }
        )
            .fromTo(cardsRef.current?.children || [],
                { x: 100, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'back.out(1.7)'
                },
                "-=0.5"
            );

        // Scroll Parallax for Background
        if (containerRef.current) {
            gsap.to('.hero-bg', {
                yPercent: 30,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });
        }

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative h-screen min-h-[800px] flex items-center overflow-hidden bg-black">
            {/* Background Image with Overlay */}
            <div className="hero-bg absolute inset-0 z-0">
                {/* Fallback/Poster Image from Unsplash - Abstract Gold */}
                <Image
                    src="https://images.unsplash.com/photo-1707572288220-b1f68bc5fa10?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGdvbGQlMjBiYXIlMjBhYnN0cmFjdHxlbnwwfHwwfHx8Mg%3D%3D"
                    alt="Gold Abstract Background"
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                {/* Optional: Keep Video if desired, but image often cleaner for 'design' feel unless connection is great */}
                {/* <video ... /> */}

                {/* Overlays for readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
            </div>

            <div ref={contentRef} className="relative z-10 container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Column: Copy */}
                <div ref={textRef} className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5A623]/10 border border-[#F5A623]/20 text-[#F5A623] text-sm font-medium mb-8 backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F5A623] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F5A623]"></span>
                        </span>
                        Live Gold Rates Active
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
                        Turn Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5A623] to-amber-200">Gold</span> into
                        <br />
                        Limitless Possibilities
                    </h1>

                    <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-xl">
                        Experience the world's premier digital gold lending platform.
                        Instant liquidity, bank-grade security, and zero paperwork.
                        Your assets, your terms.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={handleBorrowNow}
                            className="group bg-[#F5A623] hover:bg-[#F5A623]/90 text-black text-lg font-bold px-8 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(245,166,35,0.3)] hover:shadow-[0_0_30px_rgba(245,166,35,0.5)] hover:-translate-y-1"
                        >
                            Get Instant Cash
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                            className="group bg-white/5 hover:bg-white/10 text-white text-lg font-semibold px-8 py-4 rounded-xl transition-all duration-300 border border-white/10 hover:border-[#F5A623]/30 backdrop-blur-md flex items-center justify-center"
                        >
                            How it Works
                        </button>
                    </div>
                </div>

                {/* Right Column: Floating Feature Cards (Visual interest) */}
                <div ref={cardsRef} className="hidden lg:flex flex-col gap-6 items-end justify-center perspective-1000">
                    <div className="w-72 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl transform rotate-y-12 hover:rotate-0 transition-transform duration-500 hover:bg-white/10 hover:border-[#F5A623]/30 group cursor-default">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F5A623] to-amber-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                            <Zap className="w-6 h-6 text-black" />
                        </div>
                        <h3 className="text-white text-xl font-bold mb-1">Instant Approval</h3>
                        <p className="text-gray-400 text-sm">Funds in your wallet in under 60 seconds.</p>
                    </div>

                    <div className="w-72 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl transform rotate-y-12 hover:rotate-0 transition-transform duration-500 hover:bg-white/10 hover:border-[#F5A623]/30 group cursor-default mr-12">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                            <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-white text-xl font-bold mb-1">Bank-Grade Security</h3>
                        <p className="text-gray-400 text-sm">Audited smart contracts & insured custody.</p>
                    </div>

                    <div className="w-72 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl transform rotate-y-12 hover:rotate-0 transition-transform duration-500 hover:bg-white/10 hover:border-[#F5A623]/30 group cursor-default">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                            <Globe className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-white text-xl font-bold mb-1">Global Access</h3>
                        <p className="text-gray-400 text-sm">Borrow from anywhere, anytime. 24/7 availability.</p>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-[#F5A623] to-transparent opacity-50" />
            </div>
        </section>
    );
}
