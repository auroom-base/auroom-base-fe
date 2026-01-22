// V3 Landing Page - Performance Optimized
// HeroSection is statically imported (above fold, critical for LCP)
// Below-fold sections use dynamic imports to reduce initial bundle size

import dynamic from 'next/dynamic';
import { HeroSection } from '@/components/landing/v3/HeroSection';

// Dynamic imports for below-fold sections
// These will be loaded after the initial page load, improving TTI and LCP
const ProblemSolutionSection = dynamic(
  () => import('@/components/landing/v3/ProblemSolutionSection').then(mod => mod.ProblemSolutionSection),
  { ssr: true }
);

const HowItWorksSection = dynamic(
  () => import('@/components/landing/v3/HowItWorksSection').then(mod => mod.HowItWorksSection),
  { ssr: true }
);

const BenefitsSection = dynamic(
  () => import('@/components/landing/v3/BenefitsSection').then(mod => mod.BenefitsSection),
  { ssr: true }
);

const TrustSection = dynamic(
  () => import('@/components/landing/v3/TrustSection').then(mod => mod.TrustSection),
  { ssr: true }
);

const FAQSection = dynamic(
  () => import('@/components/landing/v3/FAQSection').then(mod => mod.FAQSection),
  { ssr: true }
);

const CTASection = dynamic(
  () => import('@/components/landing/v2/CTASection').then(mod => mod.CTASection),
  { ssr: true }
);

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 1. Hero Section - Static import (above fold, critical for LCP) */}
      <HeroSection />

      {/* 2. Problem & Solution - Dynamic import */}
      <ProblemSolutionSection />

      {/* 3. How It Works - Dynamic import */}
      <HowItWorksSection />

      {/* 4. Benefits / Why AuRoom - Dynamic import */}
      <BenefitsSection />

      {/* 5. Trust Indicators (Live Stats + Security + Tech Partners) - Dynamic import */}
      <TrustSection />

      {/* 6. FAQ - Dynamic import */}
      <FAQSection />

      {/* 7. Final CTA - Dynamic import */}
      <CTASection />
    </div>
  );
}
