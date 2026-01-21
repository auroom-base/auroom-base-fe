// BenefitsSection - Hybrid SSR/CSR Component
// Static data defined on server, animations handled by client component

import { BenefitsAnimated } from '@/components/animation/BenefitsAnimated';

const benefits = [
    {
        iconType: 'zap' as const,
        title: 'Lightning Fast',
        description: 'Instant liquidity. Get stablecoins in your wallet minutes after depositing your gold.',
        image: 'https://images.unsplash.com/photo-1657408056887-c8c627f7574a?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        iconType: 'percent' as const,
        title: 'Zero Hidden Fees',
        description: 'Transparent 0.5% flat fee. No compound interest, no administration charges.',
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2672&auto=format&fit=crop',
    },
    {
        iconType: 'shield' as const,
        title: 'Bank-Grade Security',
        description: 'Your physical gold is insured and stored in regulated vaults. Smart contracts are audited.',
        image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2670&auto=format&fit=crop',
    },
    {
        iconType: 'globe' as const,
        title: '24/7 Access',
        description: 'Your assets never sleep. Borrow or repay anytime, from anywhere in the world.',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop',
    },
    {
        iconType: 'smartphone' as const,
        title: 'Fully Digital',
        description: 'No paperwork, no office visits. Manage your loans entirely from your dashboard.',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2670&auto=format&fit=crop',
    },
    {
        iconType: 'refresh' as const,
        title: 'Flexible Repayment',
        description: 'You set the schedule. Repay partially or fully whenever you want without penalties.',
        image: 'https://images.unsplash.com/photo-1638202947561-e372255007b3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHNjaGVkdWxlJTIwY2xvY2t8ZW58MHx8MHx8fDI%3D',
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
    return <BenefitsAnimated benefits={benefits} comparisonData={comparisonData} />;
}
