import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { Toaster } from '@/components/ui/Toaster';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://worldvideoads.com';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'World Video Ads - Video Ads from around the world',
    template: '%s | World Video Ads',
  },
  description:
    'A collection of past, present and trending video commercials from around the world.',
  keywords: [
    'video commercials',
    'tv spot',
    'web video commercials',
    'video ads',
    'tv ads',
    'adverts',
    'video adverts',
    'world video ads',
    'world tv ads',
  ],
  authors: [{ name: 'World Video Ads' }],
  creator: 'World Video Ads',
  publisher: 'World Video Ads',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    siteName: 'World Video Ads',
    title: 'World Video Ads - Video Ads from around the world',
    description:
      'A collection of past, present and trending video commercials from around the world.',
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'World Video Ads - Video Ads from around the world',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'World Video Ads - Video Ads from around the world',
    description:
      'A collection of past, present and trending video commercials from around the world.',
    images: ['/images/og-default.jpg'],
  },
  alternates: {
    canonical: './',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen antialiased">
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange={false}
          >
            <Toaster>
              {children}
            </Toaster>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}