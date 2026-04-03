import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import logoW from '../image/logo_w.png'

const navItems = [
  { label: 'Home', href: '/dashboard' },
  { label: 'Event', href: '/EventHighlight' },
  { label: 'Cara Kerja', href: '/dashboard#cara-kerja' },
]

const Nav = () => {
  const navTextStroke = { WebkitTextStroke: '0.5px #3b2a1a' }

  return (
    <div className="fixed top-3 left-1/2 z-50 w-[95%] max-w-4xl -translate-x-1/2 sm:top-4 sm:w-[90%]">
      <nav
        className="flex items-center justify-between rounded-full px-3 py-2.5 sm:px-5 sm:py-3"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Logo */}
        <div className="flex shrink-0 items-center gap-2">
          <Image src={logoW} alt="LokaBudaya logo" width={28} height={28} priority />
          <span className="text-xs font-semibold tracking-wide text-white sm:text-sm" style={navTextStroke}>LokaBudaya</span>
        </div>

        {/* Nav links */}
        <ul className="m-0 hidden list-none items-center gap-10 p-0 md:flex">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="text-white/90 stroke-brown text-sm font-medium hover:text-white transition-colors"
                style={navTextStroke}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Icons */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Bell */}
          <button className="hidden text-white/90 transition-colors hover:text-white md:block" aria-label="Notifications">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          {/* Login */}
          <Link
            href="/sign-in"
            className="rounded-full bg-[#C9A25A] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#b9934f] md:px-5 md:text-sm"
          >
            Login
          </Link>
        </div>
      </nav>
    </div>
  )
}

export default Nav