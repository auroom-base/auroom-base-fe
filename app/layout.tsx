import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import { Header } from "@/components/layout/v2/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { OnboardingModal } from "@/components/shared/OnboardingModal";
import { ClientProviders } from "@/components/ClientProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_URL = process.env.NEXT_PUBLIC_URL || 'https://auroom-base-testnet.vercel.app';

export const metadata: Metadata = {
  title: "AuRoom - Borrow Cash with Digital Gold Collateral",
  description: "Digital pawnshop that's simple, fast, and transparent. Collateralize digital gold, receive cash to your account in minutes. Low fees, 24/7 process.",
  keywords: "cash loan, gold collateral, digital pawnshop, XAUT, gold-backed loan, crypto loan, DeFi lending",
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
  openGraph: {
    title: "AuRoom - Digital Gold Pawnshop",
    description: "Collateralize digital gold, receive cash in minutes. Low fees, 24/7 process.",
    images: [`${APP_URL}/og-image.png`],
  },
  other: {
    'base:app_id': '6964f1288a6eeb04b568e080',
    'fc:miniapp': JSON.stringify({
      version: 'next',
      imageUrl: `${APP_URL}/og-image.png`,
      button: {
        title: 'Launch AuRoom',
        action: {
          type: 'launch_miniapp',
          name: 'AuRoom',
          url: APP_URL,
          splashImageUrl: `${APP_URL}/logo.svg`,
          splashBackgroundColor: '#000000',
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black overscroll-none`}
      >
        <ClientProviders>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 pb-20 md:pb-0">{children}</main>
            <Footer />
            {/* <BottomNavigation /> */}
            <OnboardingModal />
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
