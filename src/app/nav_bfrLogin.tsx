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
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl">
      <nav
        className="flex items-center justify-between px-5 py-3 rounded-full"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <Image src={logoW} alt="budayaHub logo" width={28} height={28} priority />
          <span className="text-white font-semibold text-sm tracking-wide" style={navTextStroke}>budayaHub</span>
        </div>

        {/* Nav links */}
        <ul className="flex items-center gap-10 list-none m-0 p-0">
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
        <div className="flex items-center gap-4">
          {/* Bell */}
          <button className="text-white/90 hover:text-white transition-colors" aria-label="Notifications">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          {/* Login */}
          <Link
            href="/sign-up"
            className="rounded-full bg-[#C9A25A] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#b9934f]"
          >
            Login
          </Link>
        </div>
      </nav>
    </div>
  )
}

export default Nav