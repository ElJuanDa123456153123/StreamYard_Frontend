import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'StreamYard Clone - Live Streaming Platform',
  description: 'Professional live streaming platform for content creators',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
