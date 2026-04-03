'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

const REVEAL_SELECTOR = [
  'main section',
  'main article',
  'main [data-animate]',
  'main .glass',
  'main .glass-dark',
  'main .rounded-2xl',
  'main .rounded-3xl',
].join(',')

const smoothScrollToHash = (hash: string) => {
  if (!hash) {
    return
  }

  const id = decodeURIComponent(hash.replace('#', ''))
  if (!id) {
    return
  }

  const target = document.getElementById(id)
  if (!target) {
    return
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
    block: 'start',
  })
}

export default function GlobalFluidMotion() {
  const pathname = usePathname()
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pageRoots = document.querySelectorAll<HTMLElement>('main')

    if (media.matches) {
      pageRoots.forEach((root) => {
        root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)
        .forEach((element) => element.classList.add('is-revealed'))
      })
      return
    }

    const body = document.body
    body.classList.remove('route-enter')
    void body.offsetHeight
    body.classList.add('route-enter')

    const enterTimer = window.setTimeout(() => {
      body.classList.remove('route-enter')
    }, 550)

    observerRef.current?.disconnect()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -8% 0px',
      },
    )

    observerRef.current = observer

    const elements = document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)
    elements.forEach((element, index) => {
      element.classList.remove('is-revealed')
      element.classList.add('scroll-reveal')
      element.style.setProperty('--reveal-delay', `${Math.min(index * 40, 360)}ms`)
      observer.observe(element)
    })

    return () => {
      window.clearTimeout(enterTimer)
      body.classList.remove('route-enter')
      observer.disconnect()
    }
  }, [pathname])

  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const anchor = target?.closest('a[href*="#"]') as HTMLAnchorElement | null

      if (!anchor) {
        return
      }

      const destination = new URL(anchor.href, window.location.href)
      const samePath = destination.pathname === window.location.pathname

      if (!samePath || !destination.hash) {
        return
      }

      event.preventDefault()

      if (window.location.hash !== destination.hash) {
        window.history.pushState(null, '', `${destination.pathname}${destination.hash}`)
      }

      smoothScrollToHash(destination.hash)
    }

    document.addEventListener('click', handleAnchorClick)
    return () => {
      document.removeEventListener('click', handleAnchorClick)
    }
  }, [])

  useEffect(() => {
    if (!window.location.hash) {
      return
    }

    const frame = window.requestAnimationFrame(() => {
      smoothScrollToHash(window.location.hash)
    })

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [pathname])

  return null
}
