import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TX3Y Directory - A Source of Truth for Business Presence',
  description: 'Trusted, Reliable Business Information. Powered by TX3Y.',
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
