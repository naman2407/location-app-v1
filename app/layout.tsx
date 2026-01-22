import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ABCD Directory - Your Go-To Guide for Businesses',
  description: 'Discover businesses and services you can trust with ABCD Directory',
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
