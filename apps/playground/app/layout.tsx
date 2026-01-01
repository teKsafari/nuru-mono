import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,   
} 

import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { SidebarNav } from '@/components/sidebar-nav'
import { MobileBreadcrumbNav } from '@/components/mobile-breadcrumb-nav'
import { JetBrains_Mono } from 'next/font/google'

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  title: 'nuru playground',
  description: 'nuru electronics and software playground',
  generator: 'nuru',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
    other: {
      rel: 'mask-icon',
      url: '/favicon.svg',
    },
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'Nuru Playground',
    description: 'Nuru electronics and software playground',
    images: ['/favicon.svg'],
  },
  twitter: {
    card: 'summary',
    title: 'Nuru Playground',
    description: 'Nuru electronics and software playground',
    images: ['/favicon.svg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`dark ${jetbrainsMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon/icon.svg" sizes="any" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="theme-color" content="#00b4d8" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={jetbrainsMono.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
          <SidebarNav />
          <MobileBreadcrumbNav />
          <div className="pl-0 md:pl-16 pt-28 md:pt-0 pb-6 md:pb-0">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
