'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Github, Twitter, Send } from 'lucide-react';

export function Footer() {
    const footerLinks = {
        product: [
            { name: 'Cash Loans', href: '/cash-loan' },
            { name: 'Buy Gold', href: '/swap' },
            { name: 'Vault', href: '/vault' },
        ],
        resources: [
            { name: 'FAQ', href: '#faq' },
            { name: 'How It Works', href: '#how-it-works' },
            { name: 'Contact Us', href: '#' },
        ],
        legal: [
            { name: 'Terms', href: '#' },
            { name: 'Privacy', href: '#' },
            { name: 'Risk Disclaimer', href: '#' },
        ],
    };

    const socialLinks = [
        { name: 'Twitter', icon: Twitter, href: '#' },
        { name: 'Telegram', icon: Send, href: '#' },
        { name: 'GitHub', icon: Github, href: '#' },
    ];

    return (
        <footer className="border-t border-white/10 bg-zinc-950">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Brand */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-3">
                            <Image
                                src="/logo.svg"
                                alt="AuRoom Logo"
                                width={32}
                                height={32}
                            />
                            <div>
                                <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 bg-clip-text text-transparent">
                                    AuRoom
                                </h3>
                            </div>
                        </div>
                        <p className="text-sm text-white/60">
                            Digital Pawnshop for the Modern Era
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="font-bold mb-4 text-white">Product</h4>
                        <ul className="space-y-2">
                            {footerLinks.product.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-white/60 hover:text-yellow-500 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-bold mb-4 text-white">Help</h4>
                        <ul className="space-y-2">
                            {footerLinks.resources.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-white/60 hover:text-yellow-500 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-bold mb-4 text-white">Technology</h4>
                        <ul className="space-y-2">
                            <li className="text-sm text-white/60">Base Network</li>
                            <li className="text-sm text-white/60">Smart Contract</li>
                            <li className="text-sm text-white/60">Documentation</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-white/10 mt-8 pt-8 space-y-4">
                    {/* Social Links */}
                    <div className="flex justify-center gap-6">
                        {socialLinks.map((social) => (
                            <Link
                                key={social.name}
                                href={social.href}
                                className="text-white/60 hover:text-yellow-500 transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={social.name}
                            >
                                <social.icon className="h-5 w-5" />
                            </Link>
                        ))}
                    </div>

                    {/* Copyright & Disclaimer */}
                    <div className="text-center space-y-2">
                        <p className="text-sm text-white/60">
                            © 2026 AuRoom Protocol. Built on Base Sepolia Testnet.
                        </p>
                        <p className="text-sm text-yellow-500 font-medium">
                            ⚠️ DISCLAIMER
                        </p>
                        <p className="text-xs text-white/60 max-w-2xl mx-auto">
                            AuRoom is a testnet platform for technology demonstration.
                            All transactions use testnet tokens with no real value.
                            Not financial or investment advice.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
