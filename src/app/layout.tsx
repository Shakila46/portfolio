import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Shakila Praween — Full Stack Developer',
  description: 'Flutter & React developer crafting cross-platform apps and AI-powered solutions.',
  themeColor: '#04050a',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className="noise-overlay" aria-hidden="true" />
        <div id="cursor-dot" aria-hidden="true" />
        <div id="cursor-ring" aria-hidden="true" />
        {children}
      </body>
    </html>
  )
}
