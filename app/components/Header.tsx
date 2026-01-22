'use client'

import { useState } from 'react'
import { SafeImage } from './SafeImage'
import { Link } from './Link'
import { IMAGES } from '../constants/images'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <div className="bg-white relative w-full">
        <div className="relative flex items-center justify-center md:justify-between overflow-hidden px-4 sm:px-8 lg:px-8 xl:px-[150px] h-[96px] w-full max-w-[1440px] mx-auto">
          {/* Mobile/Tablet hamburger button */}
          <button
            className="absolute left-4 sm:left-8 lg:left-8 xl:left-[150px] flex items-center md:hidden text-sm font-medium text-black"
            aria-label="Menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          {/* Logo - centered on mobile/tablet, left on desktop */}
          <div className="overflow-hidden relative shrink-0 w-[48px] h-[48px]">
            <a href="/" aria-label="Home">
              <SafeImage alt="Logo" className="block max-w-none w-full h-full" src={IMAGES.logo} />
            </a>
          </div>

          {/* Desktop link on right */}
          <div className="hidden md:flex items-center justify-center">
            <Link href="#" className="font-medium leading-[24px] text-sm sm:text-[16px] text-center">
              ABCD for Businesses
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet hamburger menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setMenuOpen(false)}>
          <div className="bg-white w-[280px] h-full shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold text-lg">Menu</h2>
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <Link href="#" className="block py-3 font-medium text-base text-black">
                ABCD for Businesses
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
