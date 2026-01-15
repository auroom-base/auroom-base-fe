'use client';

import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus, Minus } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const faqItems = [
    {
        question: "What exactly is AuRoom?",
        answer: "Think of AuRoom as your digital pawnshop, but smarter. You can borrow cash instantly using your digital gold (XAUT) as collateral. It's 100% online, lightning-fast, and comes with significantly lower fees than traditional options.",
    },
    {
        question: "How do I get my hands on digital gold (XAUT)?",
        answer: "It's easier than you think. You can purchase XAUT on major crypto exchanges like Tokocrypto or Indodax. Or, for a seamless experience, buy it directly on the AuRoom platform using IDRX (Rupiah stablecoin).",
    },
    {
        question: "Let's talk fees. What's the catch?",
        answer: "No catch, just transparency. We charge a flat service fee of 0.5% on the loan amount, one time only. No monthly interest ticking away, and absolutely no hidden fees to surprise you later.",
    },
    {
        question: "Is my gold actually safe?",
        answer: "Fort Knox safe. Your gold is secured by smart contracts on the blockchain, meaning no humans (including us!) can touch it. Once you repay your loan, the smart contract automatically releases your gold back to your wallet.",
    },
    {
        question: "How does repayment work?",
        answer: "On your terms. There are no strict deadlines. Whenever you're ready, simply pay back the loan amount, and your gold is instantly returned to your wallet. You're in control.",
    },
    {
        question: "What if I can't repay?",
        answer: "We've built in a massive safety net. Your assets are only liquidated if the gold price drops by ~67% (reaching 90% LTV). We set a conservative default of 30% LTV to keep you very, very safe from volatility.",
    },
];

export function FAQSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<HTMLDivElement>(null);
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 80%',
                },
            });

            tl.from(titleRef.current, {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
            }).from(
                (itemsRef.current as HTMLDivElement).children,
                {
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power2.out',
                },
                '-=0.5'
            );
        },
        { scope: containerRef }
    );

    return (
        <section
            ref={containerRef}
            className="py-24 md:py-32 bg-[#0A0A0A] relative overflow-hidden"
            id="faq"
        >
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#F5D061]/20 to-transparent" />

            <div className="max-w-6xl mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
                    {/* Left Column: Title & Image */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
                        <div ref={titleRef}>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                Got <span className="text-[#F5D061]">Questions?</span>
                                <br />
                                We've Got <span className="text-[#F5D061]">Answers.</span>
                            </h2>
                            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                                Everything you need to know about borrowing against your digital gold with AuRoom.
                            </p>
                            <div className="rounded-2xl overflow-hidden border border-white/10 relative aspect-[4/5] hidden lg:block">
                                <img
                                    src="https://images.unsplash.com/photo-1620325867502-221cfb5faa5f?q=80&w=2657&auto=format&fit=crop"
                                    alt="Gold Texture"
                                    className="object-cover w-full h-full opacity-80 hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Accordion */}
                    <div className="lg:col-span-8" ref={itemsRef}>
                        {faqItems.map((item, index) => (
                            <div
                                key={index}
                                className={`group border-b border-white/10 last:border-0 transition-colors duration-300 ${openIndex === index ? 'bg-white/5' : 'hover:bg-white/[0.02]'
                                    }`}
                            >
                                <button
                                    onClick={() => setOpenIndex(index === openIndex ? null : index)}
                                    className="w-full py-8 px-6 flex items-start justify-between text-left gap-4"
                                >
                                    <span className={`text-xl font-medium transition-colors duration-300 ${openIndex === index ? 'text-[#F5D061]' : 'text-white'
                                        }`}>
                                        {item.question}
                                    </span>
                                    <span className={`shrink-0 mt-1 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-[#F5D061]' : 'text-gray-500'
                                        }`}>
                                        {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                                    </span>
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <p className="px-6 pb-8 text-gray-400 leading-relaxed text-lg">
                                        {item.answer}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
