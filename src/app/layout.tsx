import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import NavSwitcher from './nav_switcher'
import GlobalFluidMotion from './globalFluidMotion'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LokaBudaya',
  description: 'Platform budaya Indonesia — Event, Kompetisi, dan Bazar',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <GlobalFluidMotion />
        <NavSwitcher />
        {children}
      </body>
    </html>
  )
}
