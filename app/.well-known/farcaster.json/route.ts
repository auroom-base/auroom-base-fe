export async function GET() {
    const URL = process.env.NEXT_PUBLIC_URL || 'https://auroom-base-testnet.vercel.app';

    return Response.json({
        accountAssociation: {
            header: "eyJmaWQiOi0xLCJ0eXBlIjoiYXV0aCIsImtleSI6IjB4ODY3MGM4N0YzZTlFQzlBNTdjMDk0MUMyMjYwMzBhNTA1MUFiRUQ0YSJ9",    // Fill after verification at Base Build
            payload: "eyJkb21haW4iOiJhdXJvb20tYmFzZS10ZXN0bmV0LnZlcmNlbC5hcHAifQ",
            signature: "AAAAAAAAAAAAAAAAyhG94Fl3s2MRZwKIYr4qFzl2yhEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAiSCrVbLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAul7REO_bo9AFv8iC11NYrLu4WEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASQ_-6NvAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAc7BxohVQdkCM0-Fb8YKAejd-v5MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAPhSELIcxQMC9He6VmhtIBncm2etAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBnwMiDJWAa5f07Fnom2QXomjzj1sHkGcDGzREcaZkwRkbVQLvdgCJm_1c80QipM8ajOos3-Idr2LgNFTxr4WOVxwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZJJkkmSSZJJkkmSSZJJkkmSSZJJkkmSSZJJkkmSSZJI"
        },
        miniapp: {
            version: "1",
            name: "AuRoom",
            homeUrl: URL,
            iconUrl: `${URL}/logo.png`,
            splashImageUrl: `${URL}/splash-icon.png`,
            splashBackgroundColor: "#000000",
            webhookUrl: `${URL}/api/webhook`,
            subtitle: "Gold-Backed Rupiah Loans",
            description: "Digital pawnshop that's simple, fast, and transparent. Collateralize digital gold, receive cash to your account in minutes.",
            screenshotUrls: [
                `${URL}/screenshot-dashboard.png`
            ],
            primaryCategory: "finance",
            tags: ["defi", "lending", "gold", "crypto", "base"],
            heroImageUrl: `${URL}/hero-image.png`,
            tagline: "Borrow Rupiah Instantly",
            ogTitle: "AuRoom - Digital Gold Pawnshop",
            ogDescription: "Collateralize digital gold, receive cash in minutes. Low fees, 24/7 process.",
            ogImageUrl: `${URL}/og-image.png`,
            noindex: false
        }
    });
}
