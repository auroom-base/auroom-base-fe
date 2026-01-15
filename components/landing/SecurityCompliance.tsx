import { SectionWrapper } from './shared/SectionWrapper';
import { FeatureCard } from './shared/FeatureCard';
import { Shield, IdCard, FileText, Clock, Check } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function SecurityCompliance() {
    const securityPillars = [
        {
            icon: Shield,
            title: 'Identity Verification',
            description: 'All users must verify identity to ensure regulatory compliance and protect the ecosystem.',
        },
        {
            icon: IdCard,
            title: 'On-Chain KYC',
            description: 'Verification stored on blockchain for transparency and immutability.',
        },
        {
            icon: FileText,
            title: 'Open Source',
            description: 'All contracts are public and viewable. Complete transparency in our code.',
        },
        {
            icon: Clock,
            title: 'Time-Locks',
            description: 'Transaction deadlines for safety. Prevents stale or malicious executions.',
        },
    ];

    const contractFeatures = [
        'Slippage Protection - Transactions revert if price moves beyond tolerance',
        'Deadline Protection - Transactions expire to prevent stale executions',
        'Access Control - Only verified users can hold XAUT and gXAUT',
        'Non-Custodial - You always control your assets, we never hold keys',
        '106/106 Tests Passing - Comprehensive test coverage',
    ];

    return (
        <SectionWrapper background="default" id="security">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                        Security & <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 bg-clip-text text-transparent">Compliance</span>
                    </h2>
                    <p className="text-lg text-white/70">
                        Your assets are protected by design
                    </p>
                </div>

                {/* Security Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {securityPillars.map((pillar, index) => (
                        <FeatureCard
                            key={index}
                            icon={pillar.icon}
                            title={pillar.title}
                            description={pillar.description}
                            iconColor="text-blue-400"
                            iconBgColor="bg-blue-500/10"
                        />
                    ))}
                </div>

                {/* Smart Contract Features */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                    <h3 className="text-xl font-bold mb-6 text-white">Smart Contract Security Features</h3>
                    <div className="space-y-3">
                        {contractFeatures.map((feature, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-white/80">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Audit Status */}
                <div className="bg-yellow-500/10 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-6">
                    <div className="space-y-3">
                        <div className="font-bold text-white">📋 Audit Status</div>
                        <div className="text-sm space-y-2 text-white/80">
                            <p>⏳ Professional audit planned for mainnet launch</p>
                            <p>Currently: Internal testing complete (106/106 tests passing)</p>
                            <p>Testnet: Mantle Sepolia deployment</p>
                        </div>
                        <div className="pt-2">
                            <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="border-yellow-500/30 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 hover:text-yellow-300"
                            >
                                <Link
                                    href="https://sepolia.mantlescan.xyz/address/0xb38139e077621421eba724008bB33C10996E6435"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View Contracts on Explorer
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}
