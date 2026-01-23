import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Yext Directory - A Source of Truth for Business Presence',
  description: 'Trusted, Reliable Business Information. Powered by Yext.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
