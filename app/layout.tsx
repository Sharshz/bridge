import type { Metadata } from 'next';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const appUrl = process.env.APP_URL || 'https://base-crossing.vercel.app';
  
  return {
    title: 'Base Crossing - Bridge to Solana',
    description: 'The fastest way to bridge assets between Base and Solana.',
    other: {
      'fc:miniapp': JSON.stringify({
        version: 'next',
        imageUrl: `${appUrl}/og-image.png`, // Placeholder for OG image
        button: {
          title: 'Bridge Now',
          action: {
            type: 'launch_miniapp',
            name: 'Base Crossing',
            url: appUrl,
            splashImageUrl: `${appUrl}/splash-image.png`,
            splashBackgroundColor: '#0A0A0C',
          },
        },
      }),
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="bg-[#0A0A0C]">{children}</body>
    </html>
  );
}
