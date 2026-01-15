// V2 Landing Page - Pinjam Tunai Focus
import { HeroSection } from '@/components/landing/v3/HeroSection';
import { ProblemSolutionSection } from '@/components/landing/v3/ProblemSolutionSection';
import { HowItWorksSection } from '@/components/landing/v3/HowItWorksSection';
import { BenefitsSection } from '@/components/landing/v3/BenefitsSection';
import { TrustSection } from '@/components/landing/v3/TrustSection';
import { FAQSection } from '@/components/landing/v3/FAQSection';
import { CTASection } from '@/components/landing/v2/CTASection';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Problem & Solution */}
      <ProblemSolutionSection />

      {/* 3. How It Works */}
      <HowItWorksSection />

      {/* 4. Benefits / Why AuRoom */}
      <BenefitsSection />

      {/* 5. Trust Indicators (Live Stats + Security + Tech Partners) */}
      <TrustSection />

      {/* 6. FAQ */}
      <FAQSection />

      {/* 7. Final CTA */}
      <CTASection />
    </div>
  );
}
