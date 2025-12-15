import type { Metadata } from 'next'
import { Overpass } from 'next/font/google'
import './globals.css'

const overpass = Overpass({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'SiGap Dengue - Deteksi Demam Berdarah Dengue Lebih Dini',
  description: 'Sistem deteksi Demam Berdarah Dengue (DBD) menggunakan AI',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="shortcut icon" href="/uty_logo.png" type="image/x-icon" />
        <link rel="preload" as="image" href="/magnifying_glass.jpg" />
      </head>
      <body className={overpass.className}>
        {children}
      </body>
    </html>
  )
}
