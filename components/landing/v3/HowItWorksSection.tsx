'use client';

import { useRef } from 'react';
import { ArrowRight, Calculator, ShieldCheck, Zap, ArrowRightLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
    {
        number: "01",
        title: "Secure Your Asset",
        description: "Deposit your XAUT tokens into our audited smart contract vault. Your ownership is immutable and cryptographically secured.",
        image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2VjdXJlJTIwYXNzZXR8ZW58MHx8MHx8fDA%3D", // Safe/Lock/Crypto
        icon: <ShieldCheck className="w-6 h-6 text-[#F5A623]" />,
        badges: ["Non-Custodial", "Audited"]
    },
    {
        number: "02",
        title: "Customize Terms",
        description: "Select your desired loan amount and duration. Our protocol instantly calculates the optimal Health Factor and collateral metrics.",
        image: "https://images.unsplash.com/photo-1763872849312-67984fbf5f68?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Trading/Chart/Interface
        icon: <Calculator className="w-6 h-6 text-[#F5A623]" />,
        badges: ["Dynamic LTV", "Real-time"]
    },
    {
        number: "03",
        title: "Instant Liquidity",
        description: "Receive stablecoins directly to your wallet in seconds. No credit checks, no banks, no waiting period.",
        image: "https://images.unsplash.com/photo-1766504172649-7c1ed823f780?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGF5bWVudCUyMHRyYW5zZmVyfGVufDB8fDB8fHwy", // Payment/Digital Transfer
        icon: <Zap className="w-6 h-6 text-[#F5A623]" />,
        badges: ["< 30s Settlement", "Automated"]
    },
];

export function HowItWorksSection() {
    const containerRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const stepsRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 70%',
                toggleActions: 'play none none reverse',
            }
        });

        // Title Animation
        tl.fromTo(titleRef.current,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
        );

        // Steps Animation
        if (stepsRef.current) {
            const steps = Array.from(stepsRef.current.children);

            steps.forEach((step, index) => {
                // Skip the line element which is the first child in desktop view logic sometimes, but here it's absolute
                if (step.classList.contains('step-item')) {
                    const stepTl = gsap.timeline({
                        scrollTrigger: {
                            trigger: step,
                            start: 'top 85%',
                            end: 'bottom 85%',
                            toggleActions: 'play none none reverse',
                        }
                    });

                    // Image reveal
                    stepTl.fromTo(step.querySelector('.step-image'),
                        { clipPath: 'inset(0 100% 0 0)' },
                        { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'power4.out' }
                    )
                        // Content reveal
                        .fromTo(step.querySelector('.step-content'),
                            { x: index % 2 === 0 ? 50 : -50, opacity: 0 },
                            { x: 0, opacity: 1, duration: 0.8 },
                            "-=0.5"
                        );
                }
            });
        }

        // Connecting Line Animation (Desktop)
        if (lineRef.current) {
            gsap.fromTo(lineRef.current,
                { height: 0 },
                {
                    height: '100%',
                    duration: 2,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: stepsRef.current,
                        start: 'top center',
                        end: 'bottom center',
                        scrub: 1,
                    }
                }
            );
        }

        // CTA Reveal
        tl.fromTo(ctaRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6 },
            "+=0.2"
        );

    }, { scope: containerRef });

    return (
        <section ref={containerRef} id="how-it-works" className="py-24 md:py-32 bg-black relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-[10%] top-[20%] w-[500px] h-[500px] bg-[#F5A623]/5 rounded-full blur-[120px]" />
                <div className="absolute right-[10%] bottom-[20%] w-[500px] h-[500px] bg-[#F5A623]/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                {/* Header */}
                <div ref={titleRef} className="text-center mb-20 md:mb-32">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#F5A623] text-sm font-medium mb-6 backdrop-blur-sm">
                        <ArrowRightLeft className="w-4 h-4" />
                        Simple 3-Step Process
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        From Gold to Cash <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5A623] to-amber-200">
                            In Minutes
                        </span>
                    </h2>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Skip the bank queues and paperwork. Leverage your digital gold for instant liquidity with institutional-grade security.
                    </p>
                </div>

                {/* Steps Container */}
                <div ref={stepsRef} className="relative flex flex-col gap-12 md:gap-32">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-white/10">
                        <div ref={lineRef} className="w-full bg-gradient-to-b from-[#F5A623] via-[#F5A623] to-transparent shadow-[0_0_10px_#F5A623]" />
                    </div>

                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`step-item flex flex-col md:flex-row items-center gap-8 md:gap-20 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''
                                }`}
                        >
                            {/* Image Side */}
                            <div className="w-full md:w-1/2 step-image relative group">
                                <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 relative">
                                    <div className="absolute inset-0 bg-black/40 z-10 group-hover:bg-black/20 transition-colors duration-500" />
                                    <Image
                                        src={step.image}
                                        alt={step.title}
                                        fill
                                        className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />

                                    {/* Number Overlay */}
                                    <div className="absolute -top-6 -left-6 z-20">
                                        <span className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white/10 to-transparent select-none">
                                            {step.number}
                                        </span>
                                    </div>
                                </div>

                                {/* Decorative elements */}
                                <div className={`absolute -bottom-4 ${index % 2 === 0 ? '-right-4' : '-left-4'} w-24 h-24 bg-[#F5A623]/10 rounded-full blur-xl`} />
                            </div>

                            {/* Content Side */}
                            <div className="w-full md:w-1/2 step-content text-center md:text-left">
                                <div className={`flex items-center gap-3 mb-4 justify-center ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}>
                                    <div className="w-12 h-12 rounded-xl bg-[#F5A623]/10 flex items-center justify-center border border-[#F5A623]/20">
                                        {step.icon}
                                    </div>
                                    <span className="text-[#F5A623] font-mono text-sm tracking-wider">STEP {step.number}</span>
                                </div>

                                <h3 className={`text-3xl md:text-4xl font-bold text-white mb-6 ${index % 2 === 1 ? 'md:text-right' : ''}`}>
                                    {step.title}
                                </h3>

                                <p className={`text-gray-400 text-lg leading-relaxed mb-8 ${index % 2 === 1 ? 'md:text-right' : ''}`}>
                                    {step.description}
                                </p>

                                <div className={`flex flex-wrap gap-3 justify-center ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}>
                                    {step.badges.map((badge, i) => (
                                        <span
                                            key={i}
                                            className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 pointer-events-none"
                                        >
                                            {badge}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div ref={ctaRef} className="text-center mt-24 md:mt-32">
                    <Link
                        href="/dashboard/borrow"
                        className="group relative inline-flex items-center gap-3 bg-[#F5A623] text-black font-bold px-10 py-5 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300"
                    >
                        <span className="relative z-10">Start Borrowing Now</span>
                        <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </Link>
                    <p className="mt-6 text-gray-500 text-sm">
                        No hidden fees. 0.5% interest rate. Instant approval.
                    </p>
                </div>
            </div>
        </section>
    );
}
