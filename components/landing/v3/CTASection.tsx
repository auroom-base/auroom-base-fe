'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
    return (
        <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-black to-black/95">
            <div className="max-w-4xl mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                >
                    {/* Glowing background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#F5A623]/10 via-[#F5A623]/20 to-[#F5A623]/10 rounded-3xl blur-3xl" />

                    {/* Content Card */}
                    <div className="relative bg-black/60 backdrop-blur-sm border border-[#F5A623]/30 rounded-3xl p-8 md:p-12 text-center">

                        {/* Headline */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
                        >
                            Ready to Get Cash?
                        </motion.h2>

                        {/* Subheadline */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
                        >
                            Collateralize your digital gold and receive cash in minutes.
                            No queues, no hassle.
                        </motion.p>

                        {/* Primary CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="mb-6"
                        >
                            <Link
                                href="/cash-loan"
                                className="inline-flex items-center gap-2 bg-[#F5A623] hover:bg-[#F5A623]/90 text-black font-bold text-lg px-10 py-5 rounded-xl transition-all duration-300 shadow-lg shadow-[#F5A623]/30 hover:shadow-[#F5A623]/50 hover:scale-105"
                            >
                                Borrow Now
                                <ArrowRight className="w-6 h-6" />
                            </Link>
                        </motion.div>

                        {/* Secondary CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            <p className="text-gray-400 mb-3">
                                Don't have digital gold yet?
                            </p>
                            <Link
                                href="/swap"
                                className="inline-flex items-center gap-2 text-[#F5A623] hover:text-[#F5A623]/80 font-semibold transition-colors"
                            >
                                Buy XAUT
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
