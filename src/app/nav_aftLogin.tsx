"use client"

import { useEffect, useRef, useState } from 'react'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { logoutUser } from '@/Services/authService'
import { clearAuthTokenCookie, getAuthTokenCookie } from '@/lib/authCookie'
import type { UserRole } from '@/types/api/auth'
import logoW from '../image/logo_w.png'

const navItems = [
  { label: 'Home', href: '/dashboard' },
  { label: 'Event', href: '/EventHighlight' },
  { label: 'Cara Kerja', href: '/dashboard#cara-kerja' },
]

type NavAfterLoginProps = {
  profileName?: string
  profileRole?: UserRole | null
}

const Nav = ({ profileName, profileRole }: NavAfterLoginProps) => {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const profileInitial = (profileName || 'P').trim().charAt(0).toUpperCase()
  const navTextStroke = { WebkitTextStroke: '0.5px #3b2a1a' }

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const targetNode = event.target as Node
      if (menuRef.current && !menuRef.current.contains(targetNode)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)

    const token = getAuthTokenCookie()

    try {
      if (token) {
        await logoutUser(token)
      }
    } catch {
      // Client should still clear session locally even when logout endpoint fails.
    } finally {
      clearAuthTokenCookie()
      window.dispatchEvent(new Event('auth-changed'))
      setIsMenuOpen(false)
      setIsLoggingOut(false)
      router.replace('/sign-in')
      router.refresh()
    }
  }

  const handlePromotorMenu = () => {
    if (profileRole === 'promotor') {
      setIsMenuOpen(false)
      router.push('/promotor/dashboard')
      return
    }

    window.alert('Akses ditolak. Menu Promotor hanya untuk akun promotor.')
    setIsMenuOpen(false)
  }

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
          <Image src={logoW} alt="LokaBudaya logo" width={28} height={28} priority />
          <span className="text-white font-semibold text-sm tracking-wide" style={navTextStroke}>LokaBudaya</span>
        </div>

        {/* Nav links */}
        <ul className="flex items-center gap-10 list-none m-0 p-0">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="text-white/90 text-sm font-medium hover:text-white transition-colors"
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

          {/* User */}
          <div className="relative" ref={menuRef}>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-white/10 text-xs font-semibold text-white transition-colors hover:bg-white/20"
              aria-label="Profile"
              title={profileName || 'Profile'}
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              {profileInitial}
            </button>

            {isMenuOpen ? (
              <div className="absolute right-0 top-11 min-w-44 rounded-xl border border-white/25 bg-[#2a2015]/90 p-2 shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-md">
                <p className="px-2 py-1 text-xs text-white/75">{profileName || 'Pengguna'}</p>
                <Link
                  href="/dashboard/mainMenu"
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-1 block w-full rounded-lg px-2 py-2 text-left text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  Menu Utama
                </Link>
                <button
                  type="button"
                  onClick={handlePromotorMenu}
                  className="mt-1 w-full rounded-lg px-2 py-2 text-left text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  Menu Promotor
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="mt-1 w-full rounded-lg px-2 py-2 text-left text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Nav