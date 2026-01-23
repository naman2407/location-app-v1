'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SafeImage } from './SafeImage'
import { Link as CustomLink } from './Link'
import { IMAGES } from '../constants/images'
import { HeroSearchBar } from './HeroSearchBar'
import { SearchOverlay } from './SearchOverlay'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false)

  return (
    <>
      <div className="bg-white relative w-full">
        {/* Mobile: Search icon left, Logo center, Hamburger right */}
        <div className="md:hidden relative flex items-center px-4 py-4">
          {/* Search icon - extreme left */}
          <div className="flex-shrink-0 w-10">
            <HeroSearchBar variant="headerMobile" onSearchIconClick={() => setSearchOverlayOpen(true)} />
          </div>

          {/* Logo - center (flex-1 to push to center, absolute for true centering) */}
          <div className="flex-1 flex justify-center">
            <div className="overflow-hidden relative shrink-0 w-[48px] h-[48px]">
              <Link href="/" aria-label="Home">
                <SafeImage alt="Logo" className="block max-w-none w-full h-full" src={IMAGES.logo} />
              </Link>
            </div>
          </div>

          {/* Hamburger - right (same width as search icon for balance) */}
          <div className="flex-shrink-0 w-10 flex justify-end">
            <button
              className="flex items-center justify-center text-sm font-medium text-black"
              aria-label="Menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop: Original layout */}
        <div className="hidden md:flex relative items-center justify-between overflow-hidden px-4 sm:px-8 lg:px-8 xl:px-[150px] h-[96px] w-full max-w-[1440px] mx-auto">
              {/* Logo - left on desktop */}
              <div className="overflow-hidden relative shrink-0 w-[48px] h-[48px]">
                <Link href="/" aria-label="Home">
                  <SafeImage alt="Logo" className="block max-w-none w-full h-full" src={IMAGES.logo} />
                </Link>
              </div>

              {/* Desktop link on right */}
              <div className="flex items-center justify-center">
                <CustomLink href="#" className="font-medium leading-[24px] text-sm sm:text-[16px] text-center">
                  Yext for Businesses
                </CustomLink>
              </div>
        </div>
      </div>

      {/* Search Overlay */}
      <SearchOverlay isOpen={searchOverlayOpen} onClose={() => setSearchOverlayOpen(false)} />

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
                  <CustomLink href="#" className="block py-3 font-medium text-base text-black">
                    Yext for Businesses
                  </CustomLink>
                </div>
          </div>
        </div>
      )}
    </>
  )
}
