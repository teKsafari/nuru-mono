import type { Metadata, Viewport } from 'next'

import {cn} from "@/lib/utils"
import { ModelPreloader } from '@/components/model-preloader'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,   
} 

import './globals.css'
import { SiteHeader } from '@/components/header'
import { JetBrains_Mono } from 'next/font/google'

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  title: 'nuru playground',
  description: 'nuru playground',
  generator: 'nuru',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon/icon.svg', type: 'image/svg+xml' },
    ]
  }
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
      <body className={cn(jetbrainsMono.className, "flex flex-col h-[100dvh]")}>
          <ModelPreloader />
          <SiteHeader />
          {/* 
          h-0 sets an explicit height so that the height of the div is not derived from the height
          of child elements
          flex-1 basically allows the div to grow to cover the rest of the available space from the parent
          This creates a situation where if the content is small, the div simply grows to fit the full screen
          If the content is huge, which would usually cause an overflow, it is ignored since an explicit height
          has been set (h-0). So this div below is always h-[100dvh] (full screen) regardless of the size of the
          child elements

          Why can't we just use 100% (h-full)? Because  <SiteHeader /> exisits. The div below cannot take 100%
          of the parent's height if another element with it's own height exists. The body would overflow. Because
          essentially you will have one element with some positive height plus 100dvh (the available viewport).
          */}
          <div className="h-0 flex flex-col flex-1">
            {children}
          </div>
      </body>
    </html>
  )
}
